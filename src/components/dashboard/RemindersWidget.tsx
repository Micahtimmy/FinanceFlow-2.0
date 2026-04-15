import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Bell,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  ChevronRight,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '@/context/UserContext'
import { isAfter, isBefore, addDays } from 'date-fns'

interface ReminderItem {
  id: string
  type: 'bill' | 'budget' | 'savings' | 'insight'
  title: string
  message: string
  severity: 'high' | 'medium' | 'low'
  actionUrl: string
  dueDate?: Date
}

const severityColors = {
  high: 'var(--color-danger)',
  medium: 'var(--color-warning)',
  low: 'var(--color-accent)',
}

const typeIcons = {
  bill: CreditCard,
  budget: AlertTriangle,
  savings: TrendingUp,
  insight: Lightbulb,
}

export function RemindersWidget() {
  const { userData } = useUser()
  const now = new Date()
  const sevenDaysFromNow = addDays(now, 7)

  const reminders = useMemo<ReminderItem[]>(() => {
    const items: ReminderItem[] = []

    // Bills due in next 7 days
    if (userData.bills) {
      userData.bills.forEach((bill) => {
        const dueDate = new Date(bill.dueDate)
        if (!bill.isPaid && isAfter(dueDate, now) && isBefore(dueDate, sevenDaysFromNow)) {
          const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          items.push({
            id: `bill-${bill.id}`,
            type: 'bill',
            title: bill.name,
            message: `$${bill.amount.toFixed(2)} due ${daysUntilDue === 0 ? 'today' : daysUntilDue === 1 ? 'tomorrow' : `in ${daysUntilDue} days`}`,
            severity: daysUntilDue <= 2 ? 'high' : daysUntilDue <= 4 ? 'medium' : 'low',
            actionUrl: '/bills',
            dueDate,
          })
        }
      })
    }

    // Budget alerts (>80% spent)
    if (userData.categories && userData.transactions) {
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      userData.categories.forEach((category) => {
        if (category.budgetAmount && category.budgetAmount > 0) {
          const spent = userData.transactions
            .filter((t) => {
              const txDate = new Date(t.date)
              return (
                t.categoryId === category.id &&
                t.type === 'expense' &&
                txDate.getMonth() === currentMonth &&
                txDate.getFullYear() === currentYear
              )
            })
            .reduce((sum, t) => sum + t.amount, 0)

          const percentUsed = (spent / category.budgetAmount) * 100

          if (percentUsed >= 80) {
            items.push({
              id: `budget-${category.id}`,
              type: 'budget',
              title: `${category.name} budget`,
              message: percentUsed >= 100
                ? `Over budget by $${(spent - category.budgetAmount).toFixed(2)}`
                : `${Math.round(percentUsed)}% used - $${(category.budgetAmount - spent).toFixed(2)} left`,
              severity: percentUsed >= 100 ? 'high' : percentUsed >= 90 ? 'medium' : 'low',
              actionUrl: '/budget',
            })
          }
        }
      })
    }

    // Savings milestones
    if (userData.savingsGoals) {
      userData.savingsGoals.forEach((goal) => {
        const percentComplete = (goal.currentAmount / goal.targetAmount) * 100
        const milestones = [25, 50, 75, 90]
        const reachedMilestone = milestones.find(
          (m) => percentComplete >= m && percentComplete < m + 10
        )

        if (reachedMilestone) {
          items.push({
            id: `savings-${goal.id}`,
            type: 'savings',
            title: goal.name,
            message: `${Math.round(percentComplete)}% complete - $${(goal.targetAmount - goal.currentAmount).toFixed(2)} to go`,
            severity: 'low',
            actionUrl: '/savings',
          })
        }
      })
    }

    // Sort by severity then by due date
    return items.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 }
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity]
      }
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime()
      }
      return 0
    }).slice(0, 5) // Show max 5 reminders
  }, [userData, now, sevenDaysFromNow])

  if (reminders.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Reminders</CardTitle>
          <Bell className="h-4 w-4 text-[var(--color-text-muted)]" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-hover)]">
              <Calendar className="h-6 w-6 text-[var(--color-text-muted)]" />
            </div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              All caught up!
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              No upcoming bills or alerts
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Reminders</CardTitle>
        <Bell className="h-4 w-4 text-[var(--color-text-muted)]" />
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.map((reminder, index) => {
          const Icon = typeIcons[reminder.type]
          const color = severityColors[reminder.severity]

          return (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={reminder.actionUrl}
                className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--color-surface-hover)]"
              >
                <div
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {reminder.title}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {reminder.message}
                  </p>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[var(--color-text-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </motion.div>
          )
        })}

        {reminders.length > 0 && (
          <Link
            to="/bills"
            className="mt-2 flex items-center justify-center gap-1 rounded-lg py-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)]/10"
          >
            View all reminders
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
