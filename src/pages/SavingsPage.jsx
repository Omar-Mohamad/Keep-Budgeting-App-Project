import React from 'react'
import { PiggyBank, ArrowRight, ShieldCheck } from 'lucide-react'
import { useDataLayer } from '../data/useDataLayer'
import { formatCurrency } from '../constants/currencies'

export function SavingsPage() {
  const { monthData, rolloverSavings } = useDataLayer()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 m-0">Savings & Rollover</h1>
        <p className="text-xs text-gray-500 mt-1 m-0">
          Automated rollover balance carried into the Master Excel Sheet
        </p>
      </div>

      <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-2xl p-6 text-[#0D47A1]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/80 rounded-xl border border-[#BBDEFB]">
            <PiggyBank className="w-6 h-6 text-[#0D47A1]" />
          </div>
          <div>
            <h2 className="text-sm font-bold m-0">Active Rollover Reserve</h2>
            <div className="text-3xl font-extrabold mt-1">
              +{formatCurrency(rolloverSavings, monthData.currency)}
            </div>
          </div>
        </div>
        <p className="text-xs text-[#0D47A1]/80 mt-4 leading-relaxed">
          Keep automatically detects gaps in activity upon login, rolls over unspent balances into the
          Master Sheet as a single lump sum, and provisions the current active month.
        </p>
      </div>
    </div>
  )
}
