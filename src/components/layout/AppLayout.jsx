import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { AddTransactionModal } from '../modals/AddTransactionModal'
import { useDataLayer } from '../../data/useDataLayer'

export function AppLayout({ activePage, setActivePage, children }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { searchQuery, setSearchQuery, syncStatus, addTransaction } = useDataLayer()

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] text-gray-900 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header
          onOpenAddModal={() => setIsAddModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          syncStatus={syncStatus}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav activePage={activePage} setActivePage={setActivePage} />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={addTransaction}
      />
    </div>
  )
}
