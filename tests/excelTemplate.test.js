import { describe, it, expect } from 'vitest'
import { buildYearlyWorkbookBuffer, MONTH_NAMES } from '../src/services/graph/excelTemplateBuilder'
import ExcelJS from 'exceljs'

describe('Excel Engine: Yearly Workbook Generator', () => {
  it('should generate a valid Budget workbook buffer containing Master Sheet and 12 monthly sheets', async () => {
    const buffer = await buildYearlyWorkbookBuffer(2026, 'EGP')
    expect(buffer).toBeDefined()
    expect(buffer.byteLength).toBeGreaterThan(1000)

    // Load back with ExcelJS to inspect internal structure
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)

    // Verify Master Sheet exists
    const masterSheet = workbook.getWorksheet('Master Sheet')
    expect(masterSheet).toBeDefined()
    expect(masterSheet.getCell('A1').value).toContain('2026')

    // Verify all 12 monthly sheets exist
    MONTH_NAMES.forEach((m) => {
      const monthSheet = workbook.getWorksheet(m)
      expect(monthSheet).toBeDefined()
      // Check net amount remaining cell formula in B7
      expect(monthSheet.getCell('B7').value.formula).toBe('(B4+B5)-B6')
    })
  })
})
