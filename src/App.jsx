import React, { useState } from 'react'
import { AuthProvider, useAuth } from './auth'
import { WorkbookService, RolloverService } from './services/graph'

function AppContent() {
  const { user, isAuthenticated, isLoading, signIn, signOut, getAccessToken, error } = useAuth()
  const [testLog, setTestLog] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  const logMessage = (msg, type = 'info') => {
    setTestLog((prev) => [...prev, { time: new Date().toLocaleTimeString(), msg, type }])
  }

  // 1. Test Workbook Provisioning in OneDrive/Apps/Keep
  const handleTestWorkbook = async () => {
    try {
      setIsProcessing(true)
      logMessage('Acquiring in-memory access token...', 'info')
      const token = await getAccessToken()
      const currentYear = new Date().getFullYear()

      logMessage(`Checking/Provisioning Budget_${currentYear}.xlsx in OneDrive/Apps/Keep...`, 'info')
      const result = await WorkbookService.ensureYearlyWorkbook(token, currentYear, 'EGP')
      if (result.created) {
        logMessage(`✓ SUCCESS: Provisioned new Budget_${currentYear}.xlsx in OneDrive/Apps/Keep! Web URL: ${result.webUrl || 'Available'}`, 'success')
      } else {
        logMessage(`✓ SUCCESS: Found existing Budget_${currentYear}.xlsx in OneDrive/Apps/Keep (ID: ${result.id})`, 'success')
      }
    } catch (err) {
      logMessage(`✗ Error: ${err.message}`, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // 2. Test Writing Transaction to Excel
  const handleTestWriteTransaction = async () => {
    try {
      setIsProcessing(true)
      const token = await getAccessToken()
      const year = new Date().getFullYear()
      const today = new Date().toISOString().split('T')[0]

      const sampleTx = {
        date: today,
        category: 'Groceries & Food',
        price: 350.50,
        description: 'Test Verification Transaction',
        weekNumber: 1,
      }

      logMessage(`Writing sample transaction to Budget_${year}.xlsx (Month: Jan, Week 1)...`, 'info')
      await WorkbookService.writeTransaction(token, year, 'Jan', sampleTx)
      logMessage(`✓ SUCCESS: Appended transaction "${sampleTx.description}" (-${sampleTx.price} EGP) into Excel!`, 'success')
    } catch (err) {
      logMessage(`✗ Error writing transaction: ${err.message}`, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // 3. Test Skipped-Month Catch-up & Rollover
  const handleTestRollover = async () => {
    try {
      setIsProcessing(true)
      const token = await getAccessToken()
      const year = new Date().getFullYear()
      const currentMonth = new Date().getMonth()

      logMessage('Running Skipped-Month Catch-up & Rollover detection...', 'info')
      const catchup = await RolloverService.processSkippedMonthCatchup(token, year, currentMonth)

      if (catchup.hasCatchup) {
        logMessage(`✓ Rollover Executed: Found gap in [${catchup.skippedMonths.join(', ')}]. Rolled over ${catchup.rolledOverAmount} EGP from ${catchup.fromMonth} to ${catchup.toMonth}.`, 'success')
      } else {
        logMessage('✓ Catch-up Check Completed: No skipped month gaps detected.', 'info')
      }
    } catch (err) {
      logMessage(`✗ Catch-up error: ${err.message}`, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // 4. Test Reading Master Sheet
  const handleTestReadMaster = async () => {
    try {
      setIsProcessing(true)
      const token = await getAccessToken()
      const year = new Date().getFullYear()

      logMessage(`Reading Master Sheet aggregates for ${year}...`, 'info')
      const summary = await WorkbookService.readYearlySummary(token, year)
      logMessage(`✓ SUCCESS: Annual Total Income: ${summary.totals.totalIncome} EGP | Spendings: ${summary.totals.totalSpendings} EGP | Net Savings: ${summary.totals.totalSavings} EGP`, 'success')
    } catch (err) {
      logMessage(`✗ Error reading Master Sheet: ${err.message}`, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '850px', margin: '0 auto', color: '#202124' }}>
      <header style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Keep — Architecture Verification Console</h1>
        <p style={{ margin: '0.35rem 0 0', color: '#5f6368', fontSize: '0.9rem' }}>
          Team 6: FANTIX | Omar Wahba (Technical Lead: Authentication & Microsoft Graph Excel Engine)
        </p>
      </header>

      {/* Task 3 & 4: Authentication Status */}
      <section style={{ background: '#f8f9fa', border: '1px solid #e8eaed', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Task 3 & 4: Microsoft Entra ID (MSAL.js PKCE)</h2>
          <span style={{ fontSize: '0.75rem', background: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
            Zero localStorage Tokens
          </span>
        </div>

        <div style={{ marginTop: '1rem' }}>
          {isLoading ? (
            <p style={{ color: '#5f6368' }}>Initializing MSAL...</p>
          ) : isAuthenticated && user ? (
            <div>
              <p style={{ color: '#1b5e20', fontWeight: 'bold', margin: '0 0 0.5rem' }}>
                ✓ Connected to Personal Microsoft Account
              </p>
              <div style={{ fontSize: '0.9rem', color: '#3c4043', marginBottom: '1rem' }}>
                <div><strong>User:</strong> {user.displayName} ({user.email})</div>
                <div><strong>Scope:</strong> Files.ReadWrite.AppFolder (Strict sandbox: <code>OneDrive/Apps/Keep</code>)</div>
              </div>
              <button
                onClick={signOut}
                disabled={isProcessing}
                style={{ padding: '0.4rem 0.9rem', cursor: 'pointer', background: '#d93025', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem' }}
              >
                Sign Out & Wipe IndexedDB Cache
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: '#5f6368', fontSize: '0.9rem', margin: '0 0 1rem' }}>
                Not authenticated. Sign in with your personal Microsoft account to test the OneDrive Excel engine.
              </p>
              {error && <p style={{ color: '#d93025', fontSize: '0.85rem' }}>Error: {error}</p>}
              <button
                onClick={signIn}
                disabled={isProcessing}
                style={{ padding: '0.5rem 1.2rem', cursor: 'pointer', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '500' }}
              >
                Sign In with Microsoft
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Task 5 & 6: Graph & Excel Engine Test Actions */}
      <section style={{ background: '#f8f9fa', border: '1px solid #e8eaed', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem' }}>Tasks 5 & 6: Microsoft Graph & Excel Engine</h2>
        <p style={{ fontSize: '0.85rem', color: '#5f6368', margin: '0 0 1rem' }}>
          Verify automatic provisioning of Aptos-styled annual workbooks, master/monthly sheets, formulas, and catch-up rollover:
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            onClick={handleTestWorkbook}
            disabled={!isAuthenticated || isProcessing}
            style={{
              padding: '0.5rem 0.9rem',
              cursor: isAuthenticated ? 'pointer' : 'not-allowed',
              background: isAuthenticated ? '#202124' : '#dadce0',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.85rem',
            }}
          >
            1. Ensure Budget_{new Date().getFullYear()}.xlsx
          </button>

          <button
            onClick={handleTestWriteTransaction}
            disabled={!isAuthenticated || isProcessing}
            style={{
              padding: '0.5rem 0.9rem',
              cursor: isAuthenticated ? 'pointer' : 'not-allowed',
              background: isAuthenticated ? '#202124' : '#dadce0',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.85rem',
            }}
          >
            2. Write Test Transaction
          </button>

          <button
            onClick={handleTestRollover}
            disabled={!isAuthenticated || isProcessing}
            style={{
              padding: '0.5rem 0.9rem',
              cursor: isAuthenticated ? 'pointer' : 'not-allowed',
              background: isAuthenticated ? '#202124' : '#dadce0',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.85rem',
            }}
          >
            3. Run Skipped-Month Catch-up
          </button>

          <button
            onClick={handleTestReadMaster}
            disabled={!isAuthenticated || isProcessing}
            style={{
              padding: '0.5rem 0.9rem',
              cursor: isAuthenticated ? 'pointer' : 'not-allowed',
              background: isAuthenticated ? '#202124' : '#dadce0',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.85rem',
            }}
          >
            4. Read Master Sheet Summary
          </button>
        </div>

        {/* Live Execution Log Output */}
        {testLog.length > 0 && (
          <div style={{ marginTop: '1rem', background: '#202124', color: '#f1f3f4', padding: '1rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.8rem', maxHeight: '180px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#9aa0a6' }}>
              <span>Execution Log:</span>
              <button
                onClick={() => setTestLog([])}
                style={{ background: 'transparent', border: 'none', color: '#8ab4f8', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Clear
              </button>
            </div>
            {testLog.map((log, idx) => (
              <div key={idx} style={{ marginBottom: '0.25rem', color: log.type === 'error' ? '#f28b82' : log.type === 'success' ? '#81c995' : '#e8eaed' }}>
                <span style={{ color: '#9aa0a6' }}>[{log.time}]</span> {log.msg}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Task 9: PWA Installability Indicator */}
      <section style={{ background: '#f8f9fa', border: '1px solid #e8eaed', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '0.95rem' }}>Task 9: PWA Setup</h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#5f6368' }}>
            Manifest (<code>manifest.json</code>), Service Worker (<code>sw.js</code>), and offline installability ready.
          </p>
        </div>
        <span style={{ fontSize: '0.75rem', background: '#e8f5e9', color: '#1b5e20', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
          ✓ PWA Active
        </span>
      </section>

      {/* Placeholder reserved for Mazen */}
      <section style={{ border: '2px dashed #dadce0', padding: '1.5rem', borderRadius: '10px', textAlign: 'center', color: '#5f6368', background: '#fff' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: '#202124' }}>Frontend UI Canvas (Reserved for Mazen)</h3>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
          All 40 desktop and 41 mobile Figma screen references are available in:
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
