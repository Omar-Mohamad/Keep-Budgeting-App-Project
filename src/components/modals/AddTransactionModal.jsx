import React, { useState } from 'react'
import { X, Calendar, DollarSign, Tag, FileText } from 'lucide-react'
import { CATEGORIES } from '../../constants/colors'

export function AddTransactionModal({ isOpen, onClose, onAddTransaction }) {
  if (!isOpen) return null

  const todayStr = new Date().toISOString().split('T')[0]
  const currentDay = new Date().getDate()
  const defaultWeek = Math.min(Math.ceil(currentDay / 7), 4)

  const [date, setDate] = useState(todayStr)
  const [category, setCategory] = useState(CATEGORIES[1].label) // Default Groceries
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [weekNumber, setWeekNumber] = useState(defaultWeek)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!price || Number(price) <= 0) return

    onAddTransaction({
      date,
      category,
      price: parseFloat(price),
      description,
      weekNumber: Number(weekNumber),
    })

    // Reset and close
    setPrice('')
    setDescription('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full border border-gray-100 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 m-0">Add New Transaction</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Amount (EGP)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xs">
                EGP
              </span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Description
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                placeholder="e.g. Carrefour grocery run"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Formula characters (=, +, -, @) are automatically stripped before writing to Excel.
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Week Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Date (Strict Date-only)
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Weekly Segment
              </label>
              <select
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
              >
                <option value={1}>Week 1 (Days 1–7)</option>
                <option value={2}>Week 2 (Days 8–14)</option>
                <option value={3}>Week 3 (Days 15–21)</option>
                <option value={4}>Week 4 (Days 22–31)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-xs"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
