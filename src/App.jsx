import React, { useState } from 'react'
import { AuthProvider } from './auth/AuthContext'
import { AppLayout } from './components/layout/AppLayout'
import {
  DashboardPage,
  TransactionsPage,
  BudgetsPage,
  SavingsPage,
  InsightsPage,
  SettingsPage,
} from './pages'

export function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />
      case 'transactions':
        return <TransactionsPage />
      case 'budgets':
        return <BudgetsPage />
      case 'savings':
        return <SavingsPage />
      case 'insights':
        return <InsightsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <AuthProvider>
      <AppLayout activePage={activePage} setActivePage={setActivePage}>
        {renderPage()}
      </AppLayout>
    </AuthProvider>
  )
}

export default App
