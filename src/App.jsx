import React from 'react'
import { AuthProvider, useAuth } from './auth'

function AppContent() {
  const { user, isAuthenticated, isLoading, signIn, signOut, error } = useAuth()

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Keep</h1>
        <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
          Team 6: FANTIX | Privacy-first personal budgeting on Microsoft OneDrive
        </p>
      </header>

      {/* Omar Wahba's Foundation & Auth Verification Section */}
      <section style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Authentication Status (Omar Wahba)</h2>
        {isLoading ? (
          <p>Initializing MSAL...</p>
        ) : isAuthenticated && user ? (
          <div>
            <p style={{ color: 'green', fontWeight: 'bold' }}>✓ Connected to Microsoft Account</p>
            <p><strong>Name:</strong> {user.displayName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button
              onClick={signOut}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <p style={{ color: '#666' }}>Not authenticated. Connect your personal Microsoft account to initialize OneDrive Excel sandbox.</p>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <button
              onClick={signIn}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#0078d4', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
              Sign In with Microsoft
            </button>
          </div>
        )}
      </section>

      {/* Frontend & UX Placeholder Section (Reserved for Mazen) */}
      <section style={{ border: '2px dashed #bbb', padding: '2rem', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
        <h3 style={{ marginTop: 0 }}>Frontend UI Placeholder (Mazen)</h3>
        <p>
          Screens will be implemented here by Mazen according to the Figma design specs located in:
          <br />
          <code>docs/designs/desktop/</code> and <code>docs/designs/mobile/</code>
        </p>
      </section>
    </div>
  )
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
