/**
 * Input Sanitization Service
 * Owner: Omar Mostafa (Data, Offline & Quality)
 *
 * Protects generated Excel files against Formula & CSV Injection attacks.
 * Strips dangerous leading characters: '=', '+', '-', '@'
 */

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input

  const trimmed = input.trim()
  const DANGEROUS_PREFIXES = ['=', '+', '-', '@']

  let sanitized = trimmed
  while (sanitized.length > 0 && DANGEROUS_PREFIXES.includes(sanitized.charAt(0))) {
    // Strip leading formula character
    sanitized = sanitized.substring(1).trim()
  }

  return sanitized
}
