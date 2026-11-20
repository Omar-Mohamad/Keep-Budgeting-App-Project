import React from 'react'
import { ReceiptText } from 'lucide-react'
import { useDataLayer } from '../data/useDataLayer'
import { formatCurrency } from '../constants/currencies'

export function TransactionsPage() {
  const { monthData } = useDataLayer()

  // Flatten all transactions across weeks
  const allTransactions = monthData.weeks.flatMap((w) =>
    w.transactions.map((tx) => ({ ...tx, weekNumber: w.weekNumber }))
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 m-0">All Transactions</h1>
        <p className="text-xs text-gray-500 mt-1 m-0">
          Complete ledger records synced with OneDrive/Apps/Keep
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">
            {allTransactions.length} Total Entries
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {allTransactions.map((tx) => (
            <div
              key={tx.id}
              className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-gray-400 text-[11px]">{tx.date}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  Week {tx.weekNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  {tx.category}
                </span>
                <span className="font-medium text-gray-900">{tx.description}</span>
              </div>
              <span className="font-mono font-semibold text-rose-600">
                -{formatCurrency(tx.price, monthData.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
