/**
 * Skipped-Month Catch-up & Rollover Service
 * Owner: Omar Wahba (Technical Lead)
 *
 * Implements Edge-Case Handler:
 * Detects gaps in activity upon login, rolls over unspent balances into the
 * Master Sheet as a single lump sum, and provisions the current active month.
 */

import { WorkbookService } from './workbookService'
import { MONTH_NAMES } from './excelTemplateBuilder'

export const RolloverService = {
  /**
   * Executes the skipped-month detection and rollover catch-up.
   * @param {string} token - Microsoft Graph Access Token
   * @param {number} year - Current Year
   * @param {number} currentMonthIndex - 0-indexed month (0 = Jan, 11 = Dec)
   * @returns {Promise<{ hasCatchup: boolean, skippedMonths: string[], rolledOverAmount: number }>}
   */
  async processSkippedMonthCatchup(token, year, currentMonthIndex = new Date().getMonth()) {
    const currentMonthCode = MONTH_NAMES[currentMonthIndex]

    // Read yearly summary from Master Sheet to inspect activity in previous months
    const summary = await WorkbookService.readYearlySummary(token, year)
    const { months } = summary

    // Find the last active month before current month
    let lastActiveMonthIdx = -1
    for (let i = currentMonthIndex - 1; i >= 0; i--) {
      const m = months[i]
      if (m.income > 0 || m.spendings > 0) {
        lastActiveMonthIdx = i
        break
      }
    }

    // If no previous months exist or the immediately preceding month was active, no gap to catch up
    if (lastActiveMonthIdx === -1 || lastActiveMonthIdx === currentMonthIndex - 1) {
      return {
        hasCatchup: false,
        skippedMonths: [],
        rolledOverAmount: 0,
      }
    }

    // Detected a gap: months between lastActiveMonthIdx and currentMonthIndex were skipped
    const skipped = []
    for (let i = lastActiveMonthIdx + 1; i < currentMonthIndex; i++) {
      skipped.push(MONTH_NAMES[i])
    }

    console.info(`[RolloverService] Detected skipped months gap: ${skipped.join(', ')}`)

    // Read the unspent balance from the last active month
    const lastActiveMonthCode = MONTH_NAMES[lastActiveMonthIdx]
    const lastActiveData = await WorkbookService.readMonthData(token, year, lastActiveMonthCode)
    const unspentBalance = Math.max(lastActiveData.netRemaining, 0)

    // Roll over unspent balance as a lump sum into the current month's Rollover Savings (Cell B4)
    if (unspentBalance > 0) {
      await WorkbookService.updateRolloverSavings(token, year, currentMonthCode, unspentBalance)
      console.info(
        `[RolloverService] Successfully rolled over ${unspentBalance} from ${lastActiveMonthCode} to ${currentMonthCode}!`
      )
    }

    return {
      hasCatchup: true,
      fromMonth: lastActiveMonthCode,
      toMonth: currentMonthCode,
      skippedMonths: skipped,
      rolledOverAmount: unspentBalance,
    }
  },
}
