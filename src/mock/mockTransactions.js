/**
 * Mock Monthly Transaction Data
 * Segmented into 4 weekly blocks (7 days each) as defined in the Excel Engine specification.
 * Dates are strictly Date-only (YYYY-MM-DD).
 */
export const MOCK_MONTH_DATA = {
  year: 2026,
  month: 11, // November
  monthName: 'November',
  currency: 'EGP',
  incomes: [
    { id: 'inc-1', source: 'Primary Salary', amount: 45000, date: '2026-11-01' },
    { id: 'inc-2', source: 'Freelance Design', amount: 12000, date: '2026-11-10' },
  ],
  rolloverSavings: 8500, // Unspent balance rolled over from previous month
  // Total Income = 45000 + 12000 = 57000
  // Total Spendings = 24700
  // Net Remaining = (Total Income + Rollover) - Total Spendings
  weeks: [
    {
      weekNumber: 1,
      dateRange: 'Nov 1 - Nov 7',
      totalSpend: 9200,
      transactions: [
        { id: 'tx-101', date: '2026-11-01', category: 'Housing & Rent', price: 7500, description: 'Apartment Monthly Rent' },
        { id: 'tx-102', date: '2026-11-03', category: 'Groceries & Food', price: 1200, description: 'Supermarket weekly stock' },
        { id: 'tx-103', date: '2026-11-05', category: 'Utilities & Bills', price: 500, description: 'Home High-Speed Fiber Internet' },
      ],
    },
    {
      weekNumber: 2,
      dateRange: 'Nov 8 - Nov 14',
      totalSpend: 5400,
      transactions: [
        { id: 'tx-201', date: '2026-11-08', category: 'Groceries & Food', price: 950, description: 'Organic farm groceries' },
        { id: 'tx-202', date: '2026-11-10', category: 'Transportation', price: 650, description: 'Gasoline refill & car wash' },
        { id: 'tx-203', date: '2026-11-12', category: 'Entertainment', price: 1800, description: 'Family dinner out' },
        { id: 'tx-204', date: '2026-11-14', category: 'Health & Fitness', price: 2000, description: 'Quarterly Gym Membership' },
      ],
    },
    {
      weekNumber: 3,
      dateRange: 'Nov 15 - Nov 21',
      totalSpend: 6100,
      transactions: [
        { id: 'tx-301', date: '2026-11-16', category: 'Groceries & Food', price: 1100, description: 'Weekly groceries' },
        { id: 'tx-302', date: '2026-11-18', category: 'Shopping & Personal', price: 3500, description: 'Winter clothing essentials' },
        { id: 'tx-303', date: '2026-11-20', category: 'Transportation', price: 1500, description: 'Monthly ride hailing fares' },
      ],
    },
    {
      weekNumber: 4,
      dateRange: 'Nov 22 - Nov 30',
      totalSpend: 4000,
      transactions: [
        { id: 'tx-401', date: '2026-11-23', category: 'Groceries & Food', price: 1400, description: 'Mid-week market run' },
        { id: 'tx-402', date: '2026-11-26', category: 'Utilities & Bills', price: 1600, description: 'Electricity and water utility bills' },
        { id: 'tx-403', date: '2026-11-28', category: 'Other', price: 1000, description: 'Home repair tools' },
      ],
    },
  ],
}
