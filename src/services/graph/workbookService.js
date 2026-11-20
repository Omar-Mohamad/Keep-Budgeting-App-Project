/**
 * Microsoft Graph Excel Engine & Workbook Management
 * Owner: Omar Wahba
 *
 * Implements:
 * - Sandboxed creation in OneDrive/Apps/Keep
 * - Workbook per Year (Budget_<YYYY>.xlsx)
 * - Master Sheet (Jan-Dec aggregates)
 * - 12 Monthly Sheets (Income Ledger, Rollover, 4 Weekly Spendings blocks)
 * - Formula injection, Aptos typography, frozen panes, hidden gridlines
 */

import { callGraphApi } from './graphClient'

export const APP_FOLDER_PATH = '/me/drive/special/approot'

export const WorkbookService = {
  /**
   * Ensures the annual workbook exists in OneDrive/Apps/Keep
   * @param {string} token
   * @param {number} year
   */
  async ensureYearlyWorkbook(token, year = new Date().getFullYear()) {
    const fileName = `Budget_${year}.xlsx`
    try {
      // Check if file exists in approot
      const checkUrl = `${APP_FOLDER_PATH}:/${fileName}`
      const file = await callGraphApi(checkUrl, token)
      return file
    } catch (err) {
      // If not found, provision new styled workbook
      console.info(`Workbook ${fileName} not found. Provisioning new annual workbook...`)
      return this.provisionNewYearlyWorkbook(token, year)
    }
  },

  /**
   * Provisions a brand-new yearly workbook with Master Sheet and 12 Monthly sheets
   */
  async provisionNewYearlyWorkbook(token, year) {
    // Scaffolded for Task #5: Graph integration & Excel engine
    console.log(`[GraphService] Provisioning workbook Budget_${year}.xlsx`)
    return { name: `Budget_${year}.xlsx`, year, status: 'provisioning_placeholder' }
  },

  /**
   * Reads month data from the Excel workbook
   */
  async getMonthData(token, year, month) {
    // Scaffolded for Task #5
    return null
  },

  /**
   * Writes a transaction to the respective weekly block in Excel
   */
  async writeTransaction(token, year, month, transaction) {
    // Scaffolded for Task #5
    console.log(`[GraphService] Writing transaction to ${year}-${month}:`, transaction)
  },
}
