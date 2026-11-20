import { describe, it, expect } from 'vitest'
import { CURRENCIES, formatCurrency, DEFAULT_CURRENCY } from '../src/constants/currencies'

describe('Localization & Currency Support', () => {
  it('should default to Egyptian Pound (EGP)', () => {
    expect(DEFAULT_CURRENCY).toBe('EGP')
    expect(CURRENCIES.EGP.code).toBe('EGP')
  })

  it('should support all required regional currencies (EGP, SAR, AED, USD, EUR)', () => {
    const supported = Object.keys(CURRENCIES)
    expect(supported).toContain('EGP')
    expect(supported).toContain('SAR')
    expect(supported).toContain('AED')
    expect(supported).toContain('USD')
    expect(supported).toContain('EUR')
  })

  it('should correctly format currency numbers', () => {
    const formattedUsd = formatCurrency(1500, 'USD')
    expect(formattedUsd).toContain('1,500.00')

    const formattedEgp = formatCurrency(45000, 'EGP')
    expect(formattedEgp).toBeDefined()
  })
})
