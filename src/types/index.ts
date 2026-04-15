export type TransactionType = 'expense' | 'income' | 'transfer'
export type RecurrencePattern = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'annually' | 'irregular'

export interface Transaction {
  id: string
  userId: string
  date: Date
  amount: number
  currency: string
  type: TransactionType
  categoryId: string
  merchantName: string
  note?: string
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern
  recurrenceGroupId?: string
  importSource: 'manual' | 'csv' | 'plaid'
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  budgetAmount?: number
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate?: Date
  createdAt: Date
}

export interface Bill {
  id: string
  name: string
  amount: number
  dueDate: Date
  isPaid: boolean
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern
}

export interface User {
  id: string
  displayName: string
  email: string
  avatarUrl?: string
  monthlyIncome: number
  primaryCurrency: string
  onboardingComplete: boolean
  primaryGoal?: string
  financialPersona?: 'aggressive-saver' | 'debt-eliminator' | 'wealth-builder' | 'balanced' | 'starting-fresh'
  createdAt: Date
}

export interface FinancialData {
  budgetAdherence: number
  savingsVelocity: number
  netCashFlowRatio: number
}

export interface PulseScore {
  score: number
  grade: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention'
  color: 'emerald' | 'blue' | 'amber' | 'red'
  breakdown: {
    budgetScore: number
    savingsScore: number
    cashFlowScore: number
  }
}

export type Theme = 'light' | 'dark' | 'system'

export interface AppSettings {
  theme: Theme
  accentColor: 'blue' | 'purple' | 'green' | 'orange' | 'rose' | 'slate'
  dashboardDensity: 'comfortable' | 'compact'
}
