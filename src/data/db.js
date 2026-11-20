/**
 * Local IndexedDB Database (PWA Offline Engine)
 * Owner: Omar Mostafa
 *
 * Stores:
 * - 'months': Cached month datasets (income, rollover, weekly spendings)
 * - 'offlineQueue': Pending mutations queued while navigator.onLine is false
 * - 'settings': User preference cache (selected currency, local state)
 */

import { openDB } from 'idb'

const DB_NAME = 'keep_budget_db'
const DB_VERSION = 1

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Store cached monthly data keyed by `${year}-${month}`
      if (!db.objectStoreNames.contains('months')) {
        db.createObjectStore('months', { keyPath: 'id' })
      }

      // Store pending offline mutations
      if (!db.objectStoreNames.contains('offlineQueue')) {
        const queueStore = db.createObjectStore('offlineQueue', {
          keyPath: 'queueId',
          autoIncrement: true,
        })
        queueStore.createIndex('by_timestamp', 'timestamp')
      }

      // Store app settings & metadata
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
      }
    },
  })
}

/**
 * Total client-side IndexedDB purge upon sign-out
 * Mandatory security requirement
 */
export async function wipeLocalDatabase() {
  try {
    const db = await getDB()
    const stores = ['months', 'offlineQueue', 'settings']
    const tx = db.transaction(stores, 'readwrite')
    for (const store of stores) {
      await tx.objectStore(store).clear()
    }
    await tx.done
    console.info('[DataLayer] Local IndexedDB successfully purged.')
  } catch (err) {
    console.error('[DataLayer] Failed to purge IndexedDB:', err)
  }
}
