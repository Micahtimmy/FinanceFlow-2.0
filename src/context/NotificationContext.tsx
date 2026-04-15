import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { Notification, NotificationSeverity } from '@/types/notification'
import { useAuth } from '@/context/AuthContext'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismissNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Generate unique ID
const generateId = () => `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Storage key
const STORAGE_KEY = 'financeflow-notifications'

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${user.id}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setNotifications(
            parsed.map((n: Notification) => ({
              ...n,
              createdAt: new Date(n.createdAt),
            }))
          )
        } catch {
          setNotifications([])
        }
      }
    }
  }, [user])

  // Save notifications to localStorage
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`${STORAGE_KEY}-${user.id}`, JSON.stringify(notifications))
    }
  }, [notifications, user])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'>) => {
      if (!user) return

      const newNotification: Notification = {
        ...notification,
        id: generateId(),
        userId: user.id,
        isRead: false,
        createdAt: new Date(),
      }

      setNotifications((prev) => [newNotification, ...prev].slice(0, 50)) // Keep max 50 notifications
    },
    [user]
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    if (user) {
      localStorage.removeItem(`${STORAGE_KEY}-${user.id}`)
    }
  }, [user])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Helper function to create common notification types
export function createBillDueNotification(billName: string, dueDate: string, amount: number): Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'> {
  return {
    type: 'bill_due',
    title: `${billName} due soon`,
    message: `$${amount.toFixed(2)} due on ${dueDate}`,
    actionUrl: '/bills',
    actionLabel: 'View Bills',
    severity: 'high',
  }
}

export function createBudgetAlertNotification(categoryName: string, percentUsed: number): Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'> {
  const severity: NotificationSeverity = percentUsed >= 100 ? 'high' : percentUsed >= 90 ? 'medium' : 'low'
  return {
    type: 'budget_alert',
    title: `${categoryName} budget alert`,
    message: percentUsed >= 100
      ? `You've exceeded your ${categoryName} budget!`
      : `You've used ${percentUsed}% of your ${categoryName} budget`,
    actionUrl: '/budget',
    actionLabel: 'View Budget',
    severity,
  }
}

export function createSavingsMilestoneNotification(goalName: string, percentComplete: number): Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'> {
  return {
    type: 'savings_milestone',
    title: `${goalName} milestone!`,
    message: `You've reached ${percentComplete}% of your goal!`,
    actionUrl: '/savings',
    actionLabel: 'View Goals',
    severity: 'low',
  }
}

export function createInsightNotification(title: string, message: string, actionUrl?: string): Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'> {
  return {
    type: 'insight',
    title,
    message,
    actionUrl,
    actionLabel: actionUrl ? 'Learn More' : undefined,
    severity: 'medium',
  }
}
