/**
 * AUTH MODULE CONTRACT
 * Owner: Omar Wahba
 * Used by: Graph Service, UI Layer (auth state & profile)
 *
 * Requirements:
 * - MSAL.js Authorization Code Flow with PKCE
 * - Multi-tenant (personal Microsoft accounts @outlook.com, @hotmail.com)
 * - Zero tokens in localStorage (strictly held in memory)
 * - Scopes: Files.ReadWrite.AppFolder, User.Read
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} displayName
 * @property {string} email
 * @property {string} [id]
 */

/**
 * @typedef {Object} AuthState
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {UserProfile|null} user
 * @property {string|null} error
 */

/**
 * Expected interface provided by Auth Module:
 */
export const IAuthModule = {
  /**
   * Triggers the interactive Microsoft Entra ID login popup or redirect.
   * @returns {Promise<UserProfile>}
   */
  signIn: async () => {},

  /**
   * Signs the user out, cleans up memory tokens, and triggers local data cache purge.
   * @returns {Promise<void>}
   */
  signOut: async () => {},

  /**
   * Acquires the active Graph API access token from memory (or refreshes silently).
   * ZERO localStorage persistence.
   * @returns {Promise<string>} Bearer Access Token
   */
  getAccessToken: async () => {},

  /**
   * Returns current user profile details.
   * @returns {UserProfile|null}
   */
  getUserProfile: () => {},
}
