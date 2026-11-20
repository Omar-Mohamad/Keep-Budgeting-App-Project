import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser'
import { msalConfig, loginRequest } from './msalConfig'
import { wipeLocalDatabase } from '../data/db'

const AuthContext = createContext(null)

let msalInstance = null

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [authStage, setAuthStage] = useState('initializing') // 'initializing' | 'restoring' | 'idle' | 'authenticating' | 'error'
  const [error, setError] = useState(null)

  // Initialize MSAL once
  useEffect(() => {
    let isMounted = true

    async function initMsal() {
      try {
        if (!msalInstance) {
          msalInstance = new PublicClientApplication(msalConfig)
          await msalInstance.initialize()
        }

        // Handle redirect promise if user was redirected from Entra
        const redirectResponse = await msalInstance.handleRedirectPromise().catch(() => null)
        
        let account = null
        if (redirectResponse?.account) {
          account = redirectResponse.account
        } else {
          const currentAccounts = msalInstance.getAllAccounts()
          if (currentAccounts.length > 0) {
            account = currentAccounts[0]
          }
        }

        if (account) {
          msalInstance.setActiveAccount(account)
          if (isMounted) {
            setUser({
              displayName: account.name || account.username,
              email: account.username,
              id: account.localAccountId,
            })
            setIsAuthenticated(true)
          }
        } else {
          // Attempt silent session restoration if supported
          try {
            setAuthStage('restoring')
            const silentResponse = await msalInstance.ssoSilent(loginRequest)
            if (silentResponse?.account && isMounted) {
              msalInstance.setActiveAccount(silentResponse.account)
              setUser({
                displayName: silentResponse.account.name || silentResponse.account.username,
                email: silentResponse.account.username,
                id: silentResponse.account.localAccountId,
              })
              setIsAuthenticated(true)
            }
          } catch {
            // Normal fallback: user must sign in interactively
          }
        }
      } catch (err) {
        console.warn('MSAL initialization warning:', err)
        if (isMounted) {
          setError(err.message || 'Failed to initialize authentication.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
          setAuthStage('idle')
        }
      }
    }

    initMsal()

    return () => {
      isMounted = false
    }
  }, [])

  // Interactive Sign In with PKCE (Popup)
  const signIn = useCallback(async () => {
    if (!msalInstance) throw new Error('MSAL is not initialized.')
    try {
      setIsLoading(true)
      setAuthStage('authenticating')
      setError(null)

      const response = await msalInstance.loginPopup(loginRequest)
      if (response?.account) {
        msalInstance.setActiveAccount(response.account)
        setUser({
          displayName: response.account.name || response.account.username,
          email: response.account.username,
          id: response.account.localAccountId,
        })
        setIsAuthenticated(true)
        return response.account
      }
    } catch (err) {
      console.error('Sign-in failed:', err)
      setError(err.message || 'Authentication error')
      throw err
    } finally {
      setIsLoading(false)
      setAuthStage('idle')
    }
  }, [])

  // Sign Out & Client-Side Cache Wipe
  const signOut = useCallback(async () => {
    if (!msalInstance) return
    try {
      setIsLoading(true)
      // Total purge of local IndexedDB cache upon logout as specified
      await wipeLocalDatabase()

      const currentAccount = msalInstance.getActiveAccount()
      if (currentAccount) {
        await msalInstance.logoutPopup({
          account: currentAccount,
          mainWindowRedirectUri: window.location.origin,
        })
      }
    } catch (err) {
      console.warn('Sign-out warning:', err)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
      setAuthStage('idle')
    }
  }, [])

  // Acquire Graph API Access Token (Held strictly in memory)
  const getAccessToken = useCallback(async () => {
    if (!msalInstance) throw new Error('MSAL is not initialized.')
    const account = msalInstance.getActiveAccount()
    if (!account) throw new Error('User is not authenticated. No active account in memory.')

    try {
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      })
      return response.accessToken
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        const response = await msalInstance.acquireTokenPopup(loginRequest)
        return response.accessToken
      }
      throw err
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        authStage,
        error,
        signIn,
        signOut,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
