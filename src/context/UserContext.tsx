import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react'
import type {
  Transaction,
  SavingsGoal,
  Bill,
  Category,
  User,
  FinancialData,
  PulseScore,
} from '@/types'
import { calculatePulseScore } from '@/lib/financial-pulse'

// Sample data for demo purposes
const sampleCategories: Category[] = [
  { id: '1', name: 'Housing', icon: '🏠', color: '#6366f1', budgetAmount: 1500 },
  { id: '2', name: 'Food & Dining', icon: '🍕', color: '#10b981', budgetAmount: 600 },
  { id: '3', name: 'Transportation', icon: '🚗', color: '#a855f7', budgetAmount: 400 },
  { id: '4', name: 'Entertainment', icon: '🎬', color: '#f59e0b', budgetAmount: 200 },
  { id: '5', name: 'Shopping', icon: '🛍️', color: '#ef4444', budgetAmount: 300 },
  { id: '6', name: 'Utilities', icon: '💡', color: '#ec4899', budgetAmount: 250 },
  { id: '7', name: 'Income', icon: '💵', color: '#10b981' },
]

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    date: new Date('2026-04-15'),
    amount: 85.32,
    currency: 'USD',
    type: 'expense',
    categoryId: '2',
    merchantName: 'Grocery Store',
    isRecurring: false,
    importSource: 'manual',
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    date: new Date('2026-04-15'),
    amount: 45.00,
    currency: 'USD',
    type: 'expense',
    categoryId: '3',
    merchantName: 'Gas Station',
    isRecurring: false,
    importSource: 'manual',
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    userId: '1',
    date: new Date('2026-04-14'),
    amount: 4500,
    currency: 'USD',
    type: 'income',
    categoryId: '7',
    merchantName: 'Employer',
    note: 'Monthly salary',
    isRecurring: true,
    recurrencePattern: 'monthly',
    importSource: 'manual',
    tags: ['salary'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    userId: '1',
    date: new Date('2026-04-14'),
    amount: 15.99,
    currency: 'USD',
    type: 'expense',
    categoryId: '4',
    merchantName: 'Netflix',
    isRecurring: true,
    recurrencePattern: 'monthly',
    importSource: 'manual',
    tags: ['subscription'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    userId: '1',
    date: new Date('2026-04-01'),
    amount: 1500,
    currency: 'USD',
    type: 'expense',
    categoryId: '1',
    merchantName: 'Landlord',
    note: 'April rent',
    isRecurring: true,
    recurrencePattern: 'monthly',
    importSource: 'manual',
    tags: ['housing'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const sampleSavingsGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 6500,
    createdAt: new Date('2026-01-01'),
  },
  {
    id: '2',
    name: 'Vacation',
    targetAmount: 3000,
    currentAmount: 1200,
    targetDate: new Date('2026-12-01'),
    createdAt: new Date('2026-02-01'),
  },
  {
    id: '3',
    name: 'New Car',
    targetAmount: 15000,
    currentAmount: 4500,
    createdAt: new Date('2026-01-15'),
  },
  {
    id: '4',
    name: 'Home Down Payment',
    targetAmount: 50000,
    currentAmount: 12000,
    createdAt: new Date('2025-06-01'),
  },
]

const sampleBills: Bill[] = [
  {
    id: '1',
    name: 'Rent',
    amount: 1500,
    dueDate: new Date('2026-05-01'),
    isPaid: false,
    isRecurring: true,
    recurrencePattern: 'monthly',
  },
  {
    id: '2',
    name: 'Electric',
    amount: 120,
    dueDate: new Date('2026-04-18'),
    isPaid: false,
    isRecurring: true,
    recurrencePattern: 'monthly',
  },
  {
    id: '3',
    name: 'Internet',
    amount: 79,
    dueDate: new Date('2026-04-20'),
    isPaid: false,
    isRecurring: true,
    recurrencePattern: 'monthly',
  },
  {
    id: '4',
    name: 'Phone',
    amount: 85,
    dueDate: new Date('2026-04-22'),
    isPaid: false,
    isRecurring: true,
    recurrencePattern: 'monthly',
  },
  {
    id: '5',
    name: 'Car Insurance',
    amount: 150,
    dueDate: new Date('2026-04-25'),
    isPaid: false,
    isRecurring: true,
    recurrencePattern: 'monthly',
  },
]

interface UserState {
  user: User | null
  transactions: Transaction[]
  savingsGoals: SavingsGoal[]
  bills: Bill[]
  categories: Category[]
  isLoading: boolean
}

type UserAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_SAVINGS_GOALS'; payload: SavingsGoal[] }
  | { type: 'ADD_SAVINGS_GOAL'; payload: SavingsGoal }
  | { type: 'UPDATE_SAVINGS_GOAL'; payload: SavingsGoal }
  | { type: 'DELETE_SAVINGS_GOAL'; payload: string }
  | { type: 'SET_BILLS'; payload: Bill[] }
  | { type: 'ADD_BILL'; payload: Bill }
  | { type: 'UPDATE_BILL'; payload: Bill }
  | { type: 'DELETE_BILL'; payload: string }
  | { type: 'MARK_BILL_PAID'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'HYDRATE'; payload: Partial<UserState> }

const initialState: UserState = {
  user: null,
  transactions: sampleTransactions,
  savingsGoals: sampleSavingsGoals,
  bills: sampleBills,
  categories: sampleCategories,
  isLoading: false,
}

const STORAGE_KEY = 'financeflow-user-data'

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload }
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] }
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      }
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      }
    case 'SET_SAVINGS_GOALS':
      return { ...state, savingsGoals: action.payload }
    case 'ADD_SAVINGS_GOAL':
      return { ...state, savingsGoals: [...state.savingsGoals, action.payload] }
    case 'UPDATE_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.map((g) =>
          g.id === action.payload.id ? action.payload : g
        ),
      }
    case 'DELETE_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.filter((g) => g.id !== action.payload),
      }
    case 'SET_BILLS':
      return { ...state, bills: action.payload }
    case 'ADD_BILL':
      return { ...state, bills: [...state.bills, action.payload] }
    case 'UPDATE_BILL':
      return {
        ...state,
        bills: state.bills.map((b) => (b.id === action.payload.id ? action.payload : b)),
      }
    case 'DELETE_BILL':
      return {
        ...state,
        bills: state.bills.filter((b) => b.id !== action.payload),
      }
    case 'MARK_BILL_PAID':
      return {
        ...state,
        bills: state.bills.map((b) => (b.id === action.payload ? { ...b, isPaid: true } : b)),
      }
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'HYDRATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

interface UserContextType {
  state: UserState
  // User data (alias for components using userData pattern)
  userData: {
    transactions: Transaction[]
    savingsGoals: SavingsGoal[]
    bills: Bill[]
    categories: Category[]
  }
  // User actions
  setUser: (user: User) => void
  // Transaction actions
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (transaction: Transaction) => void
  deleteTransaction: (id: string) => void
  // Savings goal actions
  addSavingsGoal: (goal: SavingsGoal) => void
  updateSavingsGoal: (goal: SavingsGoal) => void
  deleteSavingsGoal: (id: string) => void
  // Bill actions
  addBill: (bill: Bill) => void
  updateBill: (bill: Bill) => void
  deleteBill: (id: string) => void
  markBillPaid: (id: string) => void
  // Data management
  clearAllData: () => void
  exportData: () => void
  // Computed values
  getFinancialData: () => FinancialData
  getPulseScore: () => PulseScore
  getTotalBudget: () => number
  getTotalSpent: () => number
  getTotalSaved: () => number
  getNetWorth: () => number
  getCategorySpending: (categoryId: string) => number
  getRecentTransactions: (limit?: number) => Transaction[]
  getUpcomingBills: (days?: number) => Bill[]
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Convert date strings back to Date objects
        if (parsed.transactions) {
          parsed.transactions = parsed.transactions.map((t: Transaction) => ({
            ...t,
            date: new Date(t.date),
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
          }))
        }
        if (parsed.savingsGoals) {
          parsed.savingsGoals = parsed.savingsGoals.map((g: SavingsGoal) => ({
            ...g,
            createdAt: new Date(g.createdAt),
            targetDate: g.targetDate ? new Date(g.targetDate) : undefined,
          }))
        }
        if (parsed.bills) {
          parsed.bills = parsed.bills.map((b: Bill) => ({
            ...b,
            dueDate: new Date(b.dueDate),
          }))
        }
        dispatch({ type: 'HYDRATE', payload: parsed })
      } catch {
        // Invalid stored data, use initial state
      }
    }
  }, [])

  // Persist to localStorage on state change
  useEffect(() => {
    const dataToStore = {
      user: state.user,
      transactions: state.transactions,
      savingsGoals: state.savingsGoals,
      bills: state.bills,
      categories: state.categories,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
  }, [state.user, state.transactions, state.savingsGoals, state.bills, state.categories])

  // User actions
  const setUser = (user: User) => dispatch({ type: 'SET_USER', payload: user })

  // Transaction actions
  const addTransaction = (transaction: Transaction) =>
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction })
  const updateTransaction = (transaction: Transaction) =>
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction })
  const deleteTransaction = (id: string) =>
    dispatch({ type: 'DELETE_TRANSACTION', payload: id })

  // Savings goal actions
  const addSavingsGoal = (goal: SavingsGoal) =>
    dispatch({ type: 'ADD_SAVINGS_GOAL', payload: goal })
  const updateSavingsGoal = (goal: SavingsGoal) =>
    dispatch({ type: 'UPDATE_SAVINGS_GOAL', payload: goal })
  const deleteSavingsGoal = (id: string) =>
    dispatch({ type: 'DELETE_SAVINGS_GOAL', payload: id })

  // Bill actions
  const addBill = (bill: Bill) => dispatch({ type: 'ADD_BILL', payload: bill })
  const updateBill = (bill: Bill) => dispatch({ type: 'UPDATE_BILL', payload: bill })
  const deleteBill = (id: string) => dispatch({ type: 'DELETE_BILL', payload: id })
  const markBillPaid = (id: string) => dispatch({ type: 'MARK_BILL_PAID', payload: id })

  // Computed values
  const getTotalBudget = () => {
    return state.categories.reduce((sum, cat) => sum + (cat.budgetAmount || 0), 0)
  }

  const getCategorySpending = (categoryId: string) => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return state.transactions
      .filter(
        (t) =>
          t.categoryId === categoryId &&
          t.type === 'expense' &&
          new Date(t.date) >= startOfMonth
      )
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalSpent = () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return state.transactions
      .filter((t) => t.type === 'expense' && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalSaved = () => {
    return state.savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0)
  }

  const getNetWorth = () => {
    // Simple calculation: total saved + cash - debts
    // Add sample asset values for now
    const assets = 109700 // From NetWorth.tsx sample data
    const liabilities = 42450 // From NetWorth.tsx sample data
    return assets - liabilities
  }

  const getFinancialData = (): FinancialData => {
    const totalBudget = getTotalBudget()
    const totalSpent = getTotalSpent()
    const budgetAdherence = totalBudget > 0 ? Math.max(0, 1 - totalSpent / totalBudget) : 0

    const totalSaved = getTotalSaved()
    const totalTargets = state.savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0)
    const savingsVelocity = totalTargets > 0 ? totalSaved / totalTargets : 0

    // Net cash flow: income - expenses this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthlyIncome = state.transactions
      .filter((t) => t.type === 'income' && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0)
    const monthlyExpenses = state.transactions
      .filter((t) => t.type === 'expense' && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0)
    const netCashFlowRatio = monthlyIncome > 0 ? (monthlyIncome - monthlyExpenses) / monthlyIncome : 0

    return {
      budgetAdherence: Math.min(1, Math.max(0, budgetAdherence)),
      savingsVelocity: Math.min(1, Math.max(0, savingsVelocity)),
      netCashFlowRatio: Math.min(1, Math.max(0, netCashFlowRatio)),
    }
  }

  const getPulseScore = (): PulseScore => {
    const financialData = getFinancialData()
    return calculatePulseScore(financialData)
  }

  const getRecentTransactions = (limit = 5) => {
    return [...state.transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }

  const getUpcomingBills = (days = 7) => {
    const now = new Date()
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    return state.bills
      .filter((b) => !b.isPaid && new Date(b.dueDate) <= futureDate && new Date(b.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }

  // Clear all user data
  const clearAllData = () => {
    dispatch({ type: 'SET_TRANSACTIONS', payload: [] })
    dispatch({ type: 'SET_SAVINGS_GOALS', payload: [] })
    dispatch({ type: 'SET_BILLS', payload: [] })
    localStorage.removeItem(STORAGE_KEY)
  }

  // Export all user data as JSON
  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      transactions: state.transactions,
      savingsGoals: state.savingsGoals,
      bills: state.bills,
      categories: state.categories,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `financeflow-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Alias for components using userData pattern
  const userData = {
    transactions: state.transactions,
    savingsGoals: state.savingsGoals,
    bills: state.bills,
    categories: state.categories,
  }

  return (
    <UserContext.Provider
      value={{
        state,
        userData,
        setUser,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        addBill,
        updateBill,
        deleteBill,
        markBillPaid,
        clearAllData,
        exportData,
        getFinancialData,
        getPulseScore,
        getTotalBudget,
        getTotalSpent,
        getTotalSaved,
        getNetWorth,
        getCategorySpending,
        getRecentTransactions,
        getUpcomingBills,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// Alias for components using userData pattern
export const useUserData = useUser
