import React from 'react'
import { LayoutDashboard, ReceiptText, PieChart, PiggyBank, Settings } from 'lucide-react'

const MOBILE_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'transactions', label: 'Ledger', icon: ReceiptText },
  { id: 'budgets', label: 'Budgets', icon: PieChart },
  { id: 'savings', label: 'Savings', icon: PiggyBank },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function MobileNav({ activePage, setActivePage }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex items-center justify-around z-20 shadow-lg">
      {MOBILE_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = activePage === item.id
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
