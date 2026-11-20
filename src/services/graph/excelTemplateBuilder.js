import ExcelJS from 'exceljs'

/**
 * Excel Template Builder for Project Keep
 * Owner: Omar Wahba (Technical Lead)
 *
 * Implements the full Excel Database Engine specification:
 * - Font: Aptos (11pt body, bold headers)
 * - Master Sheet: Yearly overview aggregating Jan - Dec
 * - 12 Monthly Sheets: Header block (Income Ledger, Rollover, Net Amount Remaining)
 *   + 4 Weekly Spendings blocks (7 days each: Date, Category, Price, Description)
 *   + Summary Footers (Weekly totals, avg daily spend, avg weekly spend, total monthly spend)
 * - Regional accounting format, frozen panes, and clean view settings.
 */

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export const MONTH_FULL_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const FONT_NAME = 'Aptos'

// Design system semantic colors for Excel headers
const PALETTE = {
  headerBg: 'F1F3F4', // Slate Gray
  headerText: '202124',
  incomeBg: 'E8F5E9', // Mint Green
  incomeText: '1B5E20',
  spendingBg: 'FFEBEE', // Pale Rose
  spendingText: 'B71C1C',
  savingsBg: 'E3F2FD', // Ice Blue
  savingsText: '0D47A1',
  borderGray: 'E0E0E0',
}

/**
 * Generates the full annual Budget_<YYYY>.xlsx workbook as an ArrayBuffer.
 * @param {number} year
 * @param {string} [currency='EGP']
 * @returns {Promise<ArrayBuffer>}
 */
export async function buildYearlyWorkbookBuffer(year = new Date().getFullYear(), currency = 'EGP') {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Keep Budgeting App'
  workbook.lastModifiedBy = 'Keep Budgeting App'
  workbook.created = new Date()
  workbook.modified = new Date()

  const currencyFormat = `#,##0.00 "${currency}"`

  // -------------------------------------------------------------
  // 1. MASTER SHEET (Yearly Overview)
  // -------------------------------------------------------------
  const masterSheet = workbook.addWorksheet('Master Sheet', {
    views: [{ state: 'frozen', ySplit: 4, showGridLines: true }],
  })

  // Title
  masterSheet.getCell('A1').value = `Keep — Yearly Overview (${year})`
  masterSheet.getCell('A1').font = { name: FONT_NAME, size: 16, bold: true, color: { argb: 'FF202124' } }
  masterSheet.getCell('A2').value = `Database Engine: OneDrive/Apps/Keep | Currency: ${currency}`
  masterSheet.getCell('A2').font = { name: FONT_NAME, size: 10, italic: true, color: { argb: 'FF5F6368' } }

  // Headers (Row 4)
  const masterHeaders = ['Month', 'Total Income', 'Total Spendings', 'Net Savings']
  masterHeaders.forEach((header, idx) => {
    const cell = masterSheet.getCell(4, idx + 1)
    cell.value = header
    cell.font = { name: FONT_NAME, size: 11, bold: true, color: { argb: `FF${PALETTE.headerText}` } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${PALETTE.headerBg}` } }
    cell.alignment = { horizontal: idx === 0 ? 'left' : 'right', vertical: 'middle' }
  })

  // 12 Months Rows (Rows 5 to 16)
  MONTH_NAMES.forEach((m, idx) => {
    const rowNum = 5 + idx
    // Month label
    masterSheet.getCell(`A${rowNum}`).value = m
    masterSheet.getCell(`A${rowNum}`).font = { name: FONT_NAME, size: 11 }

    // Formulas referencing monthly sheets
    masterSheet.getCell(`B${rowNum}`).value = { formula: `'${m}'!B5`, result: 0 }
    masterSheet.getCell(`B${rowNum}`).numFmt = currencyFormat
    masterSheet.getCell(`B${rowNum}`).font = { name: FONT_NAME, size: 11 }

    masterSheet.getCell(`C${rowNum}`).value = { formula: `'${m}'!B6`, result: 0 }
    masterSheet.getCell(`C${rowNum}`).numFmt = currencyFormat
    masterSheet.getCell(`C${rowNum}`).font = { name: FONT_NAME, size: 11 }

    masterSheet.getCell(`D${rowNum}`).value = { formula: `B${rowNum}-C${rowNum}`, result: 0 }
    masterSheet.getCell(`D${rowNum}`).numFmt = currencyFormat
    masterSheet.getCell(`D${rowNum}`).font = { name: FONT_NAME, size: 11, bold: true }
  })

  // Annual Totals Row (Row 17)
  masterSheet.getCell('A17').value = 'Annual Totals'
  masterSheet.getCell('A17').font = { name: FONT_NAME, size: 11, bold: true }
  masterSheet.getCell('B17').value = { formula: 'SUM(B5:B16)', result: 0 }
  masterSheet.getCell('B17').numFmt = currencyFormat
  masterSheet.getCell('B17').font = { name: FONT_NAME, size: 11, bold: true }

  masterSheet.getCell('C17').value = { formula: 'SUM(C5:C16)', result: 0 }
  masterSheet.getCell('C17').numFmt = currencyFormat
  masterSheet.getCell('C17').font = { name: FONT_NAME, size: 11, bold: true }

  masterSheet.getCell('D17').value = { formula: 'SUM(D5:D16)', result: 0 }
  masterSheet.getCell('D17').numFmt = currencyFormat
  masterSheet.getCell('D17').font = { name: FONT_NAME, size: 11, bold: true }

  masterSheet.columns = [
    { width: 14 },
    { width: 22 },
    { width: 22 },
    { width: 22 },
  ]

  // -------------------------------------------------------------
  // 2. 12 MONTHLY SHEETS (Jan - Dec)
  // -------------------------------------------------------------
  MONTH_NAMES.forEach((monthCode, monthIdx) => {
    const fullName = MONTH_FULL_NAMES[monthIdx]
    const sheet = workbook.addWorksheet(monthCode, {
      views: [{ state: 'frozen', ySplit: 8, showGridLines: true }],
    })

    // Sheet Title
    sheet.getCell('A1').value = `${fullName} ${year} — Budget Ledger`
    sheet.getCell('A1').font = { name: FONT_NAME, size: 14, bold: true, color: { argb: 'FF202124' } }

    // --- Header Block: Metrics Summary (Rows 3-7) ---
    sheet.getCell('A3').value = 'Metric'
    sheet.getCell('B3').value = 'Amount'
    sheet.getCell('A3').font = { name: FONT_NAME, size: 10, bold: true }
    sheet.getCell('B3').font = { name: FONT_NAME, size: 10, bold: true }

    // Rollover Savings
    sheet.getCell('A4').value = 'Rollover Savings'
    sheet.getCell('B4').value = 0
    sheet.getCell('B4').numFmt = currencyFormat
    sheet.getCell('A4').font = { name: FONT_NAME, size: 10 }
    sheet.getCell('B4').font = { name: FONT_NAME, size: 10 }

    // Total Incomes
    sheet.getCell('A5').value = 'Total Incomes'
    sheet.getCell('B5').value = { formula: 'SUM(H4:H10)', result: 0 }
    sheet.getCell('B5').numFmt = currencyFormat
    sheet.getCell('A5').font = { name: FONT_NAME, size: 10, color: { argb: `FF${PALETTE.incomeText}` } }
    sheet.getCell('B5').font = { name: FONT_NAME, size: 10, bold: true, color: { argb: `FF${PALETTE.incomeText}` } }

    // Total Spendings
    sheet.getCell('A6').value = 'Total Spendings'
    sheet.getCell('B6').value = { formula: 'SUM(C25,C42,C59,C76)', result: 0 } // Sum of weekly totals
    sheet.getCell('B6').numFmt = currencyFormat
    sheet.getCell('A6').font = { name: FONT_NAME, size: 10, color: { argb: `FF${PALETTE.spendingText}` } }
    sheet.getCell('B6').font = { name: FONT_NAME, size: 10, bold: true, color: { argb: `FF${PALETTE.spendingText}` } }

    // Hero Metric: Net Amount Remaining
    sheet.getCell('A7').value = 'Net Amount Remaining'
    sheet.getCell('B7').value = { formula: '(B4+B5)-B6', result: 0 }
    sheet.getCell('B7').numFmt = currencyFormat
    sheet.getCell('A7').font = { name: FONT_NAME, size: 11, bold: true }
    sheet.getCell('B7').font = { name: FONT_NAME, size: 11, bold: true }
    sheet.getCell('A7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${PALETTE.headerBg}` } }
    sheet.getCell('B7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${PALETTE.headerBg}` } }

    // --- Header Block: Income Ledger Table (Columns F-H, Rows 3-10) ---
    sheet.getCell('F3').value = 'Date'
    sheet.getCell('G3').value = 'Income Source'
    sheet.getCell('H3').value = 'Amount'
    ;['F3', 'G3', 'H3'].forEach((c) => {
      sheet.getCell(c).font = { name: FONT_NAME, size: 10, bold: true, color: { argb: `FF${PALETTE.incomeText}` } }
      sheet.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${PALETTE.incomeBg}` } }
    })

    // Pre-allocate 6 income rows
    for (let r = 4; r <= 9; r++) {
      sheet.getCell(`F${r}`).font = { name: FONT_NAME, size: 10 }
      sheet.getCell(`G${r}`).font = { name: FONT_NAME, size: 10 }
      sheet.getCell(`H${r}`).font = { name: FONT_NAME, size: 10 }
      sheet.getCell(`H${r}`).numFmt = currencyFormat
    }
    // Income Total row
    sheet.getCell('G10').value = 'Income Total'
    sheet.getCell('G10').font = { name: FONT_NAME, size: 10, bold: true }
    sheet.getCell('H10').value = { formula: 'SUM(H4:H9)', result: 0 }
    sheet.getCell('H10').numFmt = currencyFormat
    sheet.getCell('H10').font = { name: FONT_NAME, size: 10, bold: true }

    // --- 4 WEEKLY SPENDINGS LEDGER BLOCKS ---
    const weekConfigs = [
      { num: 1, range: 'Days 1–7', startRow: 13, endRow: 24, totalRow: 25 },
      { num: 2, range: 'Days 8–14', startRow: 30, endRow: 41, totalRow: 42 },
      { num: 3, range: 'Days 15–21', startRow: 47, endRow: 58, totalRow: 59 },
      { num: 4, range: 'Days 22–31', startRow: 64, endRow: 75, totalRow: 76 },
    ]

    weekConfigs.forEach((week) => {
      // Week Title Banner
      sheet.getCell(`A${week.startRow - 1}`).value = `Week ${week.num} Spendings (${week.range})`
      sheet.getCell(`A${week.startRow - 1}`).font = { name: FONT_NAME, size: 11, bold: true }

      // Table Headers
      const headers = ['Date', 'Category', 'Price', 'Description']
      headers.forEach((h, hIdx) => {
        const colLetter = String.fromCharCode(65 + hIdx)
        const cell = sheet.getCell(`${colLetter}${week.startRow}`)
        cell.value = h
        cell.font = { name: FONT_NAME, size: 10, bold: true, color: { argb: `FF${PALETTE.spendingText}` } }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${PALETTE.spendingBg}` } }
        cell.alignment = { horizontal: hIdx === 2 ? 'right' : 'left' }
      })

      // Setup cells for the week's rows
      for (let r = week.startRow + 1; r <= week.endRow; r++) {
        sheet.getCell(`A${r}`).font = { name: FONT_NAME, size: 10 }
        sheet.getCell(`B${r}`).font = { name: FONT_NAME, size: 10 }
        sheet.getCell(`C${r}`).font = { name: FONT_NAME, size: 10 }
        sheet.getCell(`C${r}`).numFmt = currencyFormat
        sheet.getCell(`D${r}`).font = { name: FONT_NAME, size: 10 }
      }

      // Week Total Row
      sheet.getCell(`B${week.totalRow}`).value = `Week ${week.num} Total`
      sheet.getCell(`B${week.totalRow}`).font = { name: FONT_NAME, size: 10, bold: true }
      sheet.getCell(`C${week.totalRow}`).value = {
        formula: `SUM(C${week.startRow + 1}:C${week.endRow})`,
        result: 0,
      }
      sheet.getCell(`C${week.totalRow}`).numFmt = currencyFormat
      sheet.getCell(`C${week.totalRow}`).font = { name: FONT_NAME, size: 10, bold: true }
    })

    // --- Summary Footers (Rows 80-83) ---
    sheet.getCell('A80').value = 'Monthly Spend Summary'
    sheet.getCell('A80').font = { name: FONT_NAME, size: 11, bold: true }

    sheet.getCell('B80').value = 'Total Monthly Spend'
    sheet.getCell('C80').value = { formula: 'B6', result: 0 }
    sheet.getCell('C80').numFmt = currencyFormat
    sheet.getCell('B80').font = { name: FONT_NAME, size: 10, bold: true }
    sheet.getCell('C80').font = { name: FONT_NAME, size: 10, bold: true }

    sheet.getCell('B81').value = 'Average Weekly Spend'
    sheet.getCell('C81').value = { formula: 'C80/4', result: 0 }
    sheet.getCell('C81').numFmt = currencyFormat
    sheet.getCell('B81').font = { name: FONT_NAME, size: 10 }
    sheet.getCell('C81').font = { name: FONT_NAME, size: 10 }

    sheet.getCell('B82').value = 'Average Daily Spend'
    sheet.getCell('C82').value = { formula: 'C80/30', result: 0 }
    sheet.getCell('C82').numFmt = currencyFormat
    sheet.getCell('B82').font = { name: FONT_NAME, size: 10 }
    sheet.getCell('C82').font = { name: FONT_NAME, size: 10 }

    // Column widths
    sheet.columns = [
      { width: 16 }, // A: Date / Metric
      { width: 22 }, // B: Category / Metric Amount
      { width: 18 }, // C: Price / Spend Total
      { width: 34 }, // D: Description
      { width: 6 },  // E: Spacer
      { width: 14 }, // F: Income Date
      { width: 24 }, // G: Income Source
      { width: 18 }, // H: Income Amount
    ]
  })

  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}
