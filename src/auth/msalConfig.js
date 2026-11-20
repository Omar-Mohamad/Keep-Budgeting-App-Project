/**
 * MSAL Configuration for Project Keep
 * Owner: Omar Wahba
 *
 * CRITICAL SECURITY ARCHITECTURE:
 * - cacheLocation: 'memoryStorage' ensures ZERO localStorage token persistence.
 * - Authorization Code Flow with PKCE.
 * - Multi-tenant authority for personal accounts (@outlook.com, @hotmail.com, etc.)
 * - Scope: Files.ReadWrite.AppFolder ensures strict sandboxing to OneDrive/Apps/Keep
 */

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID || '00000000-0000-0000-0000-000000000000',
    authority: import.meta.env.VITE_ENTRA_AUTHORITY || 'https://login.microsoftonline.com/common',
    redirectUri: import.meta.env.VITE_ENTRA_REDIRECT_URI || window.location.origin,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'memoryStorage', // Strictly in memory — zero tokens in localStorage/sessionStorage
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false,
  },
}

export const loginRequest = {
  scopes: [
    'User.Read',
    'Files.ReadWrite.AppFolder', // Restricted to OneDrive/Apps/Keep
  ],
}
