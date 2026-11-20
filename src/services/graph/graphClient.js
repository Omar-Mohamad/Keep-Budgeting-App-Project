/**
 * Microsoft Graph API Client Wrapper
 * Owner: Omar Wahba (Technical Lead)
 *
 * Direct-to-Graph communication via secure HTTPS (graph.microsoft.com).
 * Zero intermediate backend servers.
 */

const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0'

export class GraphApiError extends Error {
  constructor(message, status, code) {
    super(message)
    this.name = 'GraphApiError'
    this.status = status
    this.code = code
  }
}

/**
 * Executes an authenticated request against Microsoft Graph with retry on rate-limiting (429).
 * @param {string} endpoint - API path or full URL
 * @param {string} token - Bearer access token
 * @param {RequestInit} [options]
 * @param {number} [retryCount=0]
 * @returns {Promise<any>}
 */
export async function callGraphApi(endpoint, token, options = {}, retryCount = 0) {
  const url = endpoint.startsWith('http') ? endpoint : `${GRAPH_BASE_URL}${endpoint}`

  const headers = new Headers(options.headers || {})
  headers.set('Authorization', `Bearer ${token}`)
  if (!headers.has('Content-Type') && !(options.body instanceof Blob || options.body instanceof Uint8Array || options.body instanceof ArrayBuffer)) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle Rate Limiting (429 Too Many Requests) with exponential backoff
  if (response.status === 429 && retryCount < 3) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '2', 10)
    const delay = Math.max(retryAfter * 1000, 1000 * Math.pow(2, retryCount))
    console.warn(`[GraphAPI] 429 Rate limited. Retrying after ${delay}ms...`)
    await new Promise((resolve) => setTimeout(resolve, delay))
    return callGraphApi(endpoint, token, options, retryCount + 1)
  }

  // 204 No Content
  if (response.status === 204) {
    return null
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const code = errorBody?.error?.code || response.statusText
    const message = errorBody?.error?.message || `Graph API error: ${response.status} ${response.statusText}`
    throw new GraphApiError(message, response.status, code)
  }

  // Handle binary downloads (e.g. workbook download)
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/octet-stream') || contentType.includes('application/vnd.openxmlformats')) {
    return response.blob()
  }

  return response.json()
}
