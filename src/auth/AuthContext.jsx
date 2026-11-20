import React, { createContext, useContext, useState, useEffect } from 'react'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig, loginRequest } from './msalConfig'

const AuthContext = createContext(null)

let msalInstance = null

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function initMsal() {
      try {
        if (!msalInstance) {
          msalInstance = new PublicClientApplication(msalConfig)
          await msalInstance.initialize()
        }

        const accounts = msalInstance.getAllAccounts()
        if (accounts.length > 0) {
          const activeAccount = accounts[0]
          msalInstance.setActiveAccount(activeAccount)
          setUser({
            displayName: activeAccount.name || activeAccount.username,
            email: activeAccount.username,
            id: activeAccount.localAccountId,
          })
          setIsAuthenticated(true)
        }
      } catch (err) {
        console.error('Failed to initialize MSAL:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    initMsal()
  }, [])

  const signIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const loginResponse = await msalInstance.loginPopup(loginRequest)
      if (loginResponse.account) {
        msalInstance.setActiveAccount(loginResponse.account)
        setUser({
          displayName: loginResponse.account.name || loginResponse.account.username,
          email: loginResponse.account.username,
          id: loginResponse.account.localAccountId,
        })
        setIsAuthenticated(true)
      }
    } catch (err) {
      console.error('Sign-in error:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      if (msalInstance) {
        await msalInstance.logoutPopup()
      }
      setUser(null)
      setIsAuthenticated(false)
    } catch (err) {
      console.error('Sign-out error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getAccessToken = async () => {
    if (!msalInstance) throw new Error('MSAL not initialized')
    const account = msalInstance.getActiveAccount()
    if (!account) throw new Error('No active account')

    try {
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      })
      return response.accessToken
    } catch (err) {
      // Fallback to interactive popup
      const response = await msalInstance.acquireTokenPopup(loginRequest)
      return response.accessToken
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
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
