import { describe, it, expect } from 'vitest'
import { sanitizeInput } from '../src/data/sanitization'

describe('Security: Formula & CSV Injection Defense', () => {
  it('should strip dangerous leading formula characters (=, +, -, @)', () => {
    expect(sanitizeInput('=SUM(A1:A10)')).toBe('SUM(A1:A10)')
    expect(sanitizeInput('+12345')).toBe('12345')
    expect(sanitizeInput('-cmd|/C')).toBe('cmd|/C')
    expect(sanitizeInput('@SUM(1,2)')).toBe('SUM(1,2)')
  })

  it('should strip multiple stacked leading dangerous characters', () => {
    expect(sanitizeInput('==++--@@dangerous')).toBe('dangerous')
  })

  it('should leave normal user text untouched', () => {
    expect(sanitizeInput('Groceries at Carrefour')).toBe('Groceries at Carrefour')
    expect(sanitizeInput('Apartment Rent Nov 2026')).toBe('Apartment Rent Nov 2026')
    expect(sanitizeInput('Price: 1500 EGP')).toBe('Price: 1500 EGP')
  })
})
