import React from 'react'
import { TrendingUp, BarChart3 } from 'lucide-react'
import { MOCK_YEAR_SUMMARY } from '../mock'
import { formatCurrency } from '../constants/currencies'

export function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 m-0">Annual Insights</h1>
        <p className="text-xs text-gray-500 mt-1 m-0">
          Aggregates from the Excel Master Sheet (Jan – Dec {MOCK_YEAR_SUMMARY.year})
        </p>
      </div>

      {/* Annual Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border border-gray-200">
          <span className="text-xs text-gray-500">Yearly Total Income</span>
          <div className="text-xl font-bold text-emerald-700 mt-1">
            {formatCurrency(MOCK_YEAR_SUMMARY.totals.totalIncome)}
          </div>
        </div>
        <div className="p-5 bg-white rounded-xl border border-gray-200">
          <span className="text-xs text-gray-500">Yearly Total Spendings</span>
          <div className="text-xl font-bold text-rose-700 mt-1">
            {formatCurrency(MOCK_YEAR_SUMMARY.totals.totalSpendings)}
          </div>
        </div>
        <div className="p-5 bg-white rounded-xl border border-gray-200">
          <span className="text-xs text-gray-500">Net Accumulated Savings</span>
          <div className="text-xl font-bold text-blue-700 mt-1">
            {formatCurrency(MOCK_YEAR_SUMMARY.totals.totalSavings)}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-3.5 border-b border-gray-100 font-semibold text-xs text-gray-700">
          Monthly Master Sheet Breakdown
        </div>
        <div className="divide-y divide-gray-100 text-xs">
          {MOCK_YEAR_SUMMARY.months.map((m) => (
            <div key={m.month} className="px-5 py-3 flex items-center justify-between">
              <span className="font-semibold text-gray-900 w-16">{m.month}</span>
              <span className="text-emerald-700 font-mono">+{formatCurrency(m.income)}</span>
              <span className="text-rose-700 font-mono">-{formatCurrency(m.spendings)}</span>
              <span className="text-blue-700 font-mono font-semibold">
                {formatCurrency(m.savings)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
