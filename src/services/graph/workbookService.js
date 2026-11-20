/**
 * Microsoft Graph Excel Engine & Workbook Management
 * Owner: Omar Wahba (Technical Lead)
 *
 * Implements:
 * - Sandboxed provisioning in OneDrive/Apps/Keep (Files.ReadWrite.AppFolder)
 * - Annual Workbook Architecture (Budget_<YYYY>.xlsx)
 * - Master Sheet aggregation & 12 Monthly sheets
 * - Transaction & Income writing
 * - Rollover savings updates
 */

import { callGraphApi, GraphApiError } from './graphClient'
import { buildYearlyWorkbookBuffer, MONTH_NAMES } from './excelTemplateBuilder'

export const APPROOT_PATH = '/me/drive/special/approot'

// Row coordinates mapping for each weekly block in monthly sheets
const WEEK_BLOCK_RANGES = {
  1: { startRow: 14, endRow: 24, totalRow: 25 },
  2: { startRow: 31, endRow: 41, totalRow: 42 },
  3: { startRow: 48, endRow: 58, totalRow: 59 },
  4: { startRow: 65, endRow: 75, totalRow: 76 },
}

export const WorkbookService = {
  /**
   * Ensures the annual workbook Budget_<YYYY>.xlsx exists in OneDrive/Apps/Keep.
   * If not found, generates and uploads the styled template.
   * @param {string} token - Graph Access Token
   * @param {number} [year] - Budget year (defaults to current year)
   * @param {string} [currency='EGP'] - User's selected currency
   * @returns {Promise<{ id: string, name: string, webUrl: string, created: boolean }>}
   */
  async ensureYearlyWorkbook(token, year = new Date().getFullYear(), currency = 'EGP') {
    const fileName = `Budget_${year}.xlsx`
    const fileEndpoint = `${APPROOT_PATH}:/${fileName}`

    try {
      // 1. Check if the file already exists
      const existingFile = await callGraphApi(fileEndpoint, token)
      console.info(`[WorkbookService] Found existing annual workbook: ${fileName}`)
      return {
        id: existingFile.id,
        name: existingFile.name,
        webUrl: existingFile.webUrl,
        created: false,
      }
    } catch (err) {
      if (err instanceof GraphApiError && err.status === 404) {
        // File does not exist: Provision new workbook
        console.info(`[WorkbookService] File ${fileName} not found. Provisioning in OneDrive/Apps/Keep...`)
        return this.provisionNewYearlyWorkbook(token, year, currency)
      }
      throw err
    }
  },

  /**
   * Provisions a brand-new yearly workbook in OneDrive/Apps/Keep
   */
  async provisionNewYearlyWorkbook(token, year, currency = 'EGP') {
    const fileName = `Budget_${year}.xlsx`
    const uploadEndpoint = `${APPROOT_PATH}:/${fileName}:/content`

    // Generate styled Excel buffer with Aptos font and Master + 12 monthly sheets
    const buffer = await buildYearlyWorkbookBuffer(year, currency)

    const uploadedFile = await callGraphApi(uploadEndpoint, token, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      body: new Uint8Array(buffer),
    })

    console.info(`[WorkbookService] Successfully provisioned ${fileName} in OneDrive/Apps/Keep!`)
    return {
      id: uploadedFile.id,
      name: uploadedFile.name,
      webUrl: uploadedFile.webUrl,
      created: true,
    }
  },

  /**
   * Reads metrics and transactions for a given month from the Excel workbook.
   * @param {string} token
   * @param {number} year
   * @param {string} monthName - 3-letter month code (e.g. 'Jan', 'Nov')
   */
  async readMonthData(token, year, monthName) {
    const fileName = `Budget_${year}.xlsx`
    const baseSheetUrl = `${APPROOT_PATH}:/${fileName}:/workbook/worksheets('${monthName}')`

    try {
      // Read Header Summary Metrics (B4:B7)
      const metricsRange = await callGraphApi(`${baseSheetUrl}/range(address='B4:B7')`, token)
      const [rollover, totalIncome, totalSpendings, netRemaining] = (metricsRange.values || []).map(r => r[0] || 0)

      // Read Income Ledger (F4:H9)
      const incomesRange = await callGraphApi(`${baseSheetUrl}/range(address='F4:H9')`, token)
      const incomes = (incomesRange.values || [])
        .filter(row => row[1] && row[2]) // Filter rows with source & amount
        .map((row, idx) => ({
          id: `inc-${idx + 1}`,
          date: row[0] || '',
          source: row[1],
          amount: Number(row[2]) || 0,
        }))

      // Read 4 Weekly Spendings Blocks
      const weeks = []
      for (let weekNum = 1; weekNum <= 4; weekNum++) {
        const cfg = WEEK_BLOCK_RANGES[weekNum]
        const weekRange = await callGraphApi(
          `${baseSheetUrl}/range(address='A${cfg.startRow}:D${cfg.endRow}')`,
          token
        )

        const txs = (weekRange.values || [])
          .filter(row => row[0] && row[2]) // Has date and price
          .map((row, idx) => ({
            id: `tx-w${weekNum}-${idx + 1}`,
            date: row[0],
            category: row[1] || 'Other',
            price: Number(row[2]) || 0,
            description: row[3] || '',
            weekNumber: weekNum,
          }))

        const totalSpend = txs.reduce((sum, t) => sum + t.price, 0)

        weeks.push({
          weekNumber: weekNum,
          totalSpend,
          transactions: txs,
        })
      }

      return {
        year,
        monthName,
        rolloverSavings: Number(rollover) || 0,
        totalIncome: Number(totalIncome) || 0,
        totalSpendings: Number(totalSpendings) || 0,
        netRemaining: Number(netRemaining) || 0,
        incomes,
        weeks,
      }
    } catch (err) {
      console.error(`[WorkbookService] Failed to read ${monthName} data:`, err)
      throw err
    }
  },

  /**
   * Appends a transaction to the respective weekly block in Excel
   * @param {string} token
   * @param {number} year
   * @param {string} monthName
   * @param {Object} transaction
   */
  async writeTransaction(token, year, monthName, transaction) {
    const fileName = `Budget_${year}.xlsx`
    const baseSheetUrl = `${APPROOT_PATH}:/${fileName}:/workbook/worksheets('${monthName}')`
    const weekNum = Number(transaction.weekNumber) || 1
    const cfg = WEEK_BLOCK_RANGES[weekNum]

    // 1. Read existing rows in this week to find first empty slot
    const existingRange = await callGraphApi(
      `${baseSheetUrl}/range(address='A${cfg.startRow}:D${cfg.endRow}')`,
      token
    )

    const values = existingRange.values || []
    let targetRow = cfg.startRow
    for (let i = 0; i < values.length; i++) {
      if (!values[i][0] && !values[i][2]) {
        targetRow = cfg.startRow + i
        break
      }
      targetRow = cfg.startRow + i + 1
    }

    if (targetRow > cfg.endRow) {
      throw new Error(`Weekly block ${weekNum} is full (maximum rows reached).`)
    }

    // 2. Write the transaction row
    const targetAddress = `A${targetRow}:D${targetRow}`
    await callGraphApi(`${baseSheetUrl}/range(address='${targetAddress}')`, token, {
      method: 'PATCH',
      body: JSON.stringify({
        values: [[
          transaction.date, // Strict date only
          transaction.category,
          transaction.price,
          transaction.description,
        ]],
      }),
    })

    console.info(`[WorkbookService] Wrote transaction to ${monthName}!${targetAddress}`)
  },

  /**
   * Writes an income entry to the Income Ledger in Excel
   */
  async writeIncome(token, year, monthName, income) {
    const fileName = `Budget_${year}.xlsx`
    const baseSheetUrl = `${APPROOT_PATH}:/${fileName}:/workbook/worksheets('${monthName}')`

    // Find empty row in Income Ledger (F4:H9)
    const existingRange = await callGraphApi(`${baseSheetUrl}/range(address='F4:H9')`, token)
    const values = existingRange.values || []
    let targetRow = 4
    for (let i = 0; i < values.length; i++) {
      if (!values[i][1] && !values[i][2]) {
        targetRow = 4 + i
        break
      }
      targetRow = 4 + i + 1
    }

    if (targetRow > 9) {
      throw new Error('Income Ledger table is full.')
    }

    const targetAddress = `F${targetRow}:H${targetRow}`
    await callGraphApi(`${baseSheetUrl}/range(address='${targetAddress}')`, token, {
      method: 'PATCH',
      body: JSON.stringify({
        values: [[income.date || '', income.source, income.amount]],
      }),
    })

    console.info(`[WorkbookService] Wrote income to ${monthName}!${targetAddress}`)
  },

  /**
   * Updates the Rollover Savings cell in the monthly sheet (Cell B4)
   */
  async updateRolloverSavings(token, year, monthName, amount) {
    const fileName = `Budget_${year}.xlsx`
    const baseSheetUrl = `${APPROOT_PATH}:/${fileName}:/workbook/worksheets('${monthName}')`

    await callGraphApi(`${baseSheetUrl}/range(address='B4')`, token, {
      method: 'PATCH',
      body: JSON.stringify({
        values: [[amount]],
      }),
    })

    console.info(`[WorkbookService] Updated rollover savings in ${monthName}!B4: ${amount}`)
  },

  /**
   * Reads Yearly Aggregates from Master Sheet
   */
  async readYearlySummary(token, year) {
    const fileName = `Budget_${year}.xlsx`
    const masterSheetUrl = `${APPROOT_PATH}:/${fileName}:/workbook/worksheets('Master Sheet')`

    // Read Months Rows (B5:D16) and Totals (B17:D17)
    const dataRange = await callGraphApi(`${masterSheetUrl}/range(address='A5:D17')`, token)
    const rows = dataRange.values || []

    const months = rows.slice(0, 12).map((r, i) => ({
      month: MONTH_NAMES[i],
      income: Number(r[1]) || 0,
      spendings: Number(r[2]) || 0,
      savings: Number(r[3]) || 0,
    }))

    const totalsRow = rows[12] || [0, 0, 0, 0]
    const totals = {
      totalIncome: Number(totalsRow[1]) || 0,
      totalSpendings: Number(totalsRow[2]) || 0,
      totalSavings: Number(totalsRow[3]) || 0,
    }

    return {
      year,
      months,
      totals,
    }
  },
}
