/**
 * Supported regional currencies
 * Default primary currency: Egyptian Pound (EGP)
 */
export const CURRENCIES = {
  EGP: { code: 'EGP', symbol: 'EGP', name: 'Egyptian Pound', locale: 'ar-EG' },
  SAR: { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', locale: 'ar-SA' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', locale: 'ar-AE' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
}

export const DEFAULT_CURRENCY = 'EGP'

export function formatCurrency(amount, currencyCode = DEFAULT_CURRENCY) {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.EGP
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
