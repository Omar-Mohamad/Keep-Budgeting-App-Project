/**
 * GRAPH SERVICE CONTRACT
 * Owner: Omar Wahba
 * Used by: Data Layer (Omar Mostafa)
 *
 * Requirements:
 * - Direct-to-Graph communication via HTTPS (graph.microsoft.com)
 * - Sandbox: OneDrive/Apps/Keep (Files.ReadWrite.AppFolder)
 * - Workbook per Year (e.g. Budget_2026.xlsx)
 * - Automatic formatting: Aptos font, hidden gridlines, frozen panes, accounting format
 * - Master Sheet (Jan-Dec aggregates) + 12 Monthly Sheets (Income Ledger + 4 weekly spendings blocks)
 */

/**
 * @typedef {Object} TransactionInput
 * @property {string} date - Strict date only: YYYY-MM-DD
 * @property {string} category
 * @property {number} price
 * @property {string} description - Sanitized string
 * @property {number} weekNumber - 1, 2, 3, or 4
 */

/**
 * @typedef {Object} IncomeInput
 * @property {string} source
 * @property {number} amount
 * @property {string} date - YYYY-MM-DD
 */

/**
 * Expected interface provided by Graph Service:
 */
export const IGraphService = {
  /**
   * Checks if Budget_<year>.xlsx exists in OneDrive/Apps/Keep; provisions it if not.
   * Injects Master Sheet, Monthly sheets, formulas, frozen panes, and Aptos styling.
   * @param {number} year
   * @returns {Promise<{ fileId: string, webUrl: string }>}
   */
  ensureYearlyWorkbook: async (year) => {},

  /**
   * Fetches the entire monthly data (Income ledger, rollover, 4 weekly blocks) from Excel.
   * @param {number} year
   * @param {number} month (1-12)
   * @returns {Promise<Object>}
   */
  getMonthData: async (year, month) => {},

  /**
   * Appends or updates a transaction in the respective week's table in Excel.
   * @param {number} year
   * @param {number} month
   * @param {TransactionInput} transaction
   * @returns {Promise<void>}
   */
  writeTransaction: async (year, month, transaction) => {},

  /**
   * Adds an income entry to the Income Ledger in the monthly sheet.
   * @param {number} year
   * @param {number} month
   * @param {IncomeInput} income
   * @returns {Promise<void>}
   */
  writeIncome: async (year, month, income) => {},

  /**
   * Executes skipped-month catch-up: rolls over unspent balance into Master Sheet
   * and provisions the active month.
   * @param {number} year
   * @param {number} lastActiveMonth
   * @param {number} currentMonth
   * @returns {Promise<void>}
   */
  processRollover: async (year, lastActiveMonth, currentMonth) => {},

  /**
   * Reads yearly summary metrics from the Master Sheet.
   * @param {number} year
   * @returns {Promise<Object>}
   */
  getYearSummary: async (year) => {},
}
