import { useState, useEffect, useMemo, useCallback } from 'react'
import { MOCK_MONTH_DATA } from '../mock/mockTransactions'
import { sanitizeInput } from './sanitization'

/**
 * Data Layer React Hook
 * Co-owned by: Omar Mostafa (implementation) & Mazen (consumption in UI)
 *
 * Provides reactive access to transactions, budgets, calculations, and sync status.
 * Automatically falls back to clean mock data until Graph/Entra are authenticated.
 */
export function useDataLayer() {
  const [monthData, setMonthData] = useState(MOCK_MONTH_DATA)
  const [syncStatus, setSyncStatus] = useState('idle') // 'idle' | 'syncing' | 'offline' | 'error'
  const [searchQuery, setSearchQuery] = useState('')

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => setSyncStatus('idle')
    const handleOffline = () => setSyncStatus('offline')

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Dynamic calculations
  const totalIncome = useMemo(() => {
    return monthData.incomes.reduce((acc, curr) => acc + curr.amount, 0)
  }, [monthData.incomes])

  const totalSpendings = useMemo(() => {
    return monthData.weeks.reduce((acc, week) => acc + week.totalSpend, 0)
  }, [monthData.weeks])

  // Net Amount Remaining = (Total Incomes + Rollover) - Total Spendings
  const netRemaining = useMemo(() => {
    return (totalIncome + monthData.rolloverSavings) - totalSpendings
  }, [totalIncome, monthData.rolloverSavings, totalSpendings])

  // Average daily & weekly spend
  const avgWeeklySpend = useMemo(() => {
    return totalSpendings / (monthData.weeks.length || 1)
  }, [totalSpendings, monthData.weeks.length])

  const avgDailySpend = useMemo(() => {
    // 28/30 days approximation
    return totalSpendings / 30
  }, [totalSpendings])

  /**
   * Adds a new transaction with automatic formula sanitization
   */
  const addTransaction = useCallback((tx) => {
    const sanitizedDescription = sanitizeInput(tx.description || '')
    const priceNum = Number(tx.price) || 0
    const weekNum = Number(tx.weekNumber) || 1

    const newTx = {
      id: `tx-${Date.now()}`,
      date: tx.date || new Date().toISOString().split('T')[0],
      category: tx.category || 'Other',
      price: priceNum,
      description: sanitizedDescription,
    }

    setMonthData((prev) => {
      const updatedWeeks = prev.weeks.map((week) => {
        if (week.weekNumber === weekNum) {
          const updatedTxs = [newTx, ...week.transactions]
          return {
            ...week,
            transactions: updatedTxs,
            totalSpend: week.totalSpend + priceNum,
          }
        }
        return week
      })

      return {
        ...prev,
        weeks: updatedWeeks,
      }
    })

    return newTx
  }, [])

  return {
    monthData,
    totalIncome,
    totalSpendings,
    netRemaining,
    rolloverSavings: monthData.rolloverSavings,
    avgWeeklySpend,
    avgDailySpend,
    syncStatus,
    searchQuery,
    setSearchQuery,
    addTransaction,
  }
}
