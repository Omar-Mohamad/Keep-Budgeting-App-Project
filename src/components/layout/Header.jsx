import React from 'react'
import { Plus, Search, Cloud, CloudOff, RefreshCw } from 'lucide-react'

export function Header({
  onOpenAddModal,
  searchQuery,
  setSearchQuery,
  syncStatus = 'idle',
}) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Instant search transactions (e.g. groceries, rent)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Sync Status Badge & Primary Action */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Sync Status Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-white shadow-2xs">
          {syncStatus === 'syncing' && (
            <>
              <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
              <span className="text-blue-700">Syncing...</span>
            </>
          )}
          {syncStatus === 'offline' && (
            <>
              <CloudOff className="w-3 h-3 text-amber-600" />
              <span className="text-amber-700">Offline (Queued)</span>
            </>
          )}
          {syncStatus === 'idle' && (
            <>
              <Cloud className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700">OneDrive Synced</span>
            </>
          )}
          {syncStatus === 'error' && (
            <>
              <CloudOff className="w-3 h-3 text-rose-600" />
              <span className="text-rose-700">Sync Error</span>
            </>
          )}
        </div>

        {/* Add Transaction Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-xs active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>
    </header>
  )
}
