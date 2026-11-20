import React from 'react'
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  PiggyBank,
  TrendingUp,
  Settings,
  LogOut,
  LogIn,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../auth'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ReceiptText },
  { id: 'budgets', label: 'Budgets', icon: PieChart },
  { id: 'savings', label: 'Savings & Rollover', icon: PiggyBank },
  { id: 'insights', label: 'Insights', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ activePage, setActivePage }) {
  const { user, isAuthenticated, signIn, signOut } = useAuth()

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-white h-screen sticky top-0 p-5 select-none justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-lg tracking-tight shadow-sm">
            K
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-semibold text-gray-900 text-lg tracking-tight m-0 leading-tight">
                Keep
              </h1>
              <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                PWA
              </span>
            </div>
            <p className="text-xs text-gray-500 font-normal m-0">OneDrive Excel Engine</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* User Profile Card & Privacy Isolation Badge */}
      <div className="pt-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-gray-50 border border-gray-200/60 text-[11px] text-gray-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">Sandboxed: Apps/Keep</span>
        </div>

        {isAuthenticated && user ? (
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200/50">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-gray-900 truncate m-0">
                {user.displayName || 'Omar Wahba'}
              </p>
              <p className="text-[11px] text-gray-500 truncate m-0">
                {user.email || 'user@outlook.com'}
              </p>
            </div>
            <button
              onClick={signOut}
              title="Sign Out"
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={signIn}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            Connect OneDrive
          </button>
        )}
      </div>
    </aside>
  )
}
