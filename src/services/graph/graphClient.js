/**
 * Microsoft Graph API Client Wrapper
 * Owner: Omar Wahba
 *
 * Direct-to-Graph communication via secure HTTPS (graph.microsoft.com).
 * Zero intermediate backend servers.
 */

const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0'

export async function callGraphApi(endpoint, token, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${GRAPH_BASE_URL}${endpoint}`
  
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `Graph API error: ${response.status} ${response.statusText}`)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null
  }

  return response.json()
}
