import React from 'react'
import { motion } from 'framer-motion'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { useDataLayer } from '../data/useDataLayer'
import { formatCurrency } from '../constants/currencies'

export function DashboardPage() {
  const {
    monthData,
    totalIncome,
    totalSpendings,
    netRemaining,
    rolloverSavings,
    avgWeeklySpend,
    avgDailySpend,
    searchQuery,
  } = useDataLayer()

  // Filter transactions across weeks if there is an active search query
  const filteredWeeks = monthData.weeks.map((week) => {
    if (!searchQuery.trim()) return week
    const q = searchQuery.toLowerCase()
    const matchingTxs = week.transactions.filter(
      (tx) =>
        tx.description.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.price.toString().includes(q)
    )
    return {
      ...week,
      transactions: matchingTxs,
    }
  })

  return (
    <div className="space-y-6">
      {/* Month Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 m-0">
            {monthData.monthName} {monthData.year} Overview
          </h1>
          <p className="text-xs text-gray-500 mt-1 m-0">
            Automated Excel Database: <span className="font-mono text-gray-700">OneDrive/Apps/Keep/Budget_{monthData.year}.xlsx</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-2xs self-start">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>Active Period: {monthData.monthName}</span>
        </div>
      </div>

      {/* Top Metrics Grid: Double-width Hero Card for Net Remaining */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Double-Width Hero Card: Net Amount Remaining */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="col-span-1 md:col-span-2 rounded-2xl p-6 border shadow-2xs flex flex-col justify-between"
          style={{
            backgroundColor: '#F1F3F4', // Slate Gray
            borderColor: '#E0E0E0',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-600">
              Hero Metric • Net Amount Remaining
            </span>
            <div className="p-2 rounded-xl bg-white/70 border border-gray-300/50 shadow-2xs">
              <Wallet className="w-4 h-4 text-gray-800" />
            </div>
          </div>

          <div className="my-4">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#202124]">
              {formatCurrency(netRemaining, monthData.currency)}
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Dynamically calculated from Income Ledger + Rollover minus 4-Week Spendings.
            </p>
          </div>

          {/* Quick Averages Bar */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-300/50 text-xs text-gray-600">
            <div>
              <span className="text-[11px] text-gray-500 block">Avg Weekly Spend</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(avgWeeklySpend, monthData.currency)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 block">Avg Daily Spend</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(avgDailySpend, monthData.currency)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Total Incomes Card (Soft Mint Green) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-2xl p-5 border shadow-2xs flex flex-col justify-between"
          style={{
            backgroundColor: '#E8F5E9',
            borderColor: '#C8E6C9',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1B5E20] uppercase tracking-wide">
              Total Incomes
            </span>
            <div className="p-1.5 rounded-lg bg-white/80 border border-[#C8E6C9]">
              <ArrowUpRight className="w-4 h-4 text-[#1B5E20]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-[#1B5E20]">
              +{formatCurrency(totalIncome, monthData.currency)}
            </div>
            <p className="text-[11px] text-[#1B5E20]/80 mt-1">
              {monthData.incomes.length} income sources active
            </p>
          </div>
        </motion.div>

        {/* Spendings Card (Pale Rose / Crimson) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl p-5 border shadow-2xs flex flex-col justify-between"
          style={{
            backgroundColor: '#FFEBEE',
            borderColor: '#FFCDD2',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#B71C1C] uppercase tracking-wide">
              Total Spendings
            </span>
            <div className="p-1.5 rounded-lg bg-white/80 border border-[#FFCDD2]">
              <ArrowDownRight className="w-4 h-4 text-[#B71C1C]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-[#B71C1C]">
              -{formatCurrency(totalSpendings, monthData.currency)}
            </div>
            <p className="text-[11px] text-[#B71C1C]/80 mt-1">Across 4 weekly blocks</p>
          </div>
        </motion.div>
      </div>

      {/* Rollover Savings Pill / Banner (Ice Blue) */}
      <div
        className="rounded-xl p-4 border flex items-center justify-between"
        style={{
          backgroundColor: '#E3F2FD',
          borderColor: '#BBDEFB',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/80 border border-[#BBDEFB]">
            <PiggyBank className="w-4 h-4 text-[#0D47A1]" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#0D47A1] m-0">
              Rollover Savings from Previous Month
            </h2>
            <p className="text-[11px] text-[#0D47A1]/80 m-0">
              Automatically carried forward via Skipped-Month Catch-up & Excel Master Sheet.
            </p>
          </div>
        </div>
        <div className="text-base font-bold text-[#0D47A1]">
          +{formatCurrency(rolloverSavings, monthData.currency)}
        </div>
      </div>

      {/* Segmented Weekly Spendings Ledgers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-500" />
            <h2 className="text-base font-bold text-gray-900 m-0">
              Monthly Spendings Ledger (4 Weekly Blocks)
            </h2>
          </div>
          <span className="text-xs text-gray-500">
            Strict Date-only • Excel Formatted
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredWeeks.map((week) => (
            <div
              key={week.weekNumber}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs"
            >
              {/* Weekly Block Header */}
              <div className="px-5 py-3 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
                    Week {week.weekNumber}
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    {week.dateRange}
                  </span>
                </div>
                <div className="text-xs font-semibold text-gray-900">
                  Block Total: <span className="font-mono">{formatCurrency(week.totalSpend, monthData.currency)}</span>
                </div>
              </div>

              {/* Transactions Table */}
              {week.transactions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {week.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-gray-400 text-[11px] shrink-0">
                          {tx.date}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200 shrink-0">
                          {tx.category}
                        </span>
                        <span className="font-medium text-gray-900 truncate">
                          {tx.description}
                        </span>
                      </div>
                      <span className="font-mono font-semibold text-rose-600 shrink-0 ml-4">
                        -{formatCurrency(tx.price, monthData.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-6 text-center text-xs text-gray-400">
                  No transactions recorded for this weekly block.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
