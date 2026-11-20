import { useState, useEffect } from 'react'

/**
 * Data Layer Skeleton Hook
 * Co-owned by: Omar Mostafa (implementation) & Mazen (consumption)
 * Defined by: IDataLayer contract (src/contracts/dataContract.js)
 */
export function useDataLayer() {
  const [syncStatus, setSyncStatus] = useState('idle')

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

  return {
    syncStatus,
  }
}
