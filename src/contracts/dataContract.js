/**
 * DATA LAYER CONTRACT
 * Owner: Omar Mostafa
 * Used by: User Interface (Mazen)
 *
 * Requirements:
 * - Local IndexedDB caching of all months
 * - Offline write queue: queues writes when offline and flushes to GraphService upon reconnect
 * - Input sanitization: strips leading `=`, `+`, `-`, `@` characters
 * - Fast client-side search across historical transactions
 * - Full cache wipe on sign-out
 * - Sync states: 'idle' | 'syncing' | 'offline' | 'error'
 */

/**
 * @typedef {'idle' | 'syncing' | 'offline' | 'error'} SyncStatus
 */

/**
 * Expected interface provided by Data Layer to UI components:
 */
export const IDataLayer = {
  /**
   * Returns data for the specified month (served from IndexedDB cache if offline).
   * @param {number} year
   * @param {number} month
   * @returns {Promise<Object>}
   */
  getMonthTransactions: async (year, month) => {},

  /**
   * Adds a transaction with automatic input sanitization.
   * If online: sends to GraphService & updates IndexedDB.
   * If offline: appends to IndexedDB offline queue and updates optimistic local state.
   * @param {Object} transactionData
   * @returns {Promise<{ id: string, status: 'synced' | 'queued' }>}
   */
  addTransaction: async (transactionData) => {},

  /**
   * Adds an income item to the monthly ledger.
   * @param {Object} incomeData
   * @returns {Promise<void>}
   */
  addIncome: async (incomeData) => {},

  /**
   * Performs lightning-fast search over cached transactions across all months.
   * @param {string} query
   * @returns {Promise<Array<Object>>}
   */
  searchTransactions: async (query) => {},

  /**
   * Subscribes to sync status changes ('idle', 'syncing', 'offline', 'error').
   * @param {(status: SyncStatus) => void} callback
   * @returns {() => void} unsubscribe function
   */
  onSyncStatusChange: (callback) => {},

  /**
   * Sanitizes text inputs against formula & CSV injection.
   * Strips leading `=`, `+`, `-`, `@`.
   * @param {string} input
   * @returns {string}
   */
  sanitizeInput: (input) => {},

  /**
   * Wipes all IndexedDB tables completely upon user logout.
   * @returns {Promise<void>}
   */
  clearLocalData: async () => {},
}
