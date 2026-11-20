import React, { useState } from 'react'
import { CURRENCIES, DEFAULT_CURRENCY } from '../constants/currencies'
import { Trash2, ShieldCheck, RefreshCw } from 'lucide-react'
import { wipeLocalDatabase } from '../data/db'

export function SettingsPage() {
  const [selectedCurrency, setSelectedCurrency] = useState(DEFAULT_CURRENCY)
  const [wipedStatus, setWipedStatus] = useState(false)

  const handlePurge = async () => {
    if (window.confirm('Are you sure you want to purge all local cached data?')) {
      await wipeLocalDatabase()
      setWipedStatus(true)
      setTimeout(() => setWipedStatus(false), 3000)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 m-0">Settings</h1>
        <p className="text-xs text-gray-500 mt-1 m-0">
          Preferences, currency localization, and security controls
        </p>
      </div>

      {/* Currency Selection */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 m-0">Regional Currency</h2>
          <p className="text-xs text-gray-500 mt-1">
            Primary focus on Egyptian Pounds (EGP) with regional support.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.values(CURRENCIES).map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCurrency(c.code)}
              className={`p-3 rounded-lg border text-left text-xs transition-all ${
                selectedCurrency === c.code
                  ? 'border-gray-900 bg-gray-900 text-white font-semibold'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-bold">{c.code}</div>
              <div className="text-[11px] opacity-80">{c.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Security & Cache Wipe */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 m-0">Security & Cache Management</h2>
          <p className="text-xs text-gray-500 mt-1">
            Tokens are strictly kept in browser memory. Client-side IndexedDB cache can be purged at any time.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={handlePurge}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Purge Local IndexedDB Cache
          </button>
          {wipedStatus && (
            <p className="text-xs text-emerald-600 font-medium mt-2">
              ✓ Local database purged successfully!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
