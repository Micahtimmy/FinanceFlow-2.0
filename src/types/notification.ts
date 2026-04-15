export type NotificationType =
  | 'bill_due'
  | 'budget_alert'
  | 'savings_milestone'
  | 'insight'
  | 'system'

export type NotificationSeverity = 'high' | 'medium' | 'low'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
  actionLabel?: string
  severity: NotificationSeverity
  isRead: boolean
  createdAt: Date
}

export interface NotificationPreferences {
  billDue: { email: boolean; push: boolean; inApp: boolean }
  budgetAlert: { email: boolean; push: boolean; inApp: boolean }
  largeTransaction: { email: boolean; push: boolean; inApp: boolean }
  aiInsight: { email: boolean; push: boolean; inApp: boolean }
  weeklySummary: { email: boolean; push: boolean; inApp: boolean }
  monthlyNetWorth: { email: boolean; push: boolean; inApp: boolean }
  savingsGoal: { email: boolean; push: boolean; inApp: boolean }
}
