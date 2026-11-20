import React from 'react'
import { MOCK_BUDGETS } from '../mock/mockBudgets'
import { formatCurrency } from '../constants/currencies'

export function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 m-0">Monthly Budgets</h1>
        <p className="text-xs text-gray-500 mt-1 m-0">
          Target allocations vs real-time spending calculations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_BUDGETS.map((b) => {
          const percent = Math.min(Math.round((b.spent / b.allocated) * 100), 100)
          const isOver = b.spent > b.allocated

          return (
            <div
              key={b.id}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{b.category}</span>
                <span className="text-xs text-gray-500 font-mono">
                  {formatCurrency(b.spent)} / {formatCurrency(b.allocated)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOver ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>{percent}% spent</span>
                <span>
                  {isOver
                    ? `Over by ${formatCurrency(b.spent - b.allocated)}`
                    : `${formatCurrency(b.allocated - b.spent)} remaining`}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
