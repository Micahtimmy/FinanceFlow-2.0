import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Wallet } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { useUser } from '@/context/UserContext'

export function Budget() {
  const { state, getCategorySpending } = useUser()
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  // Get budget categories (those with budgetAmount set)
  const budgetCategories = useMemo(() => {
    return state.categories
      .filter(cat => cat.budgetAmount && cat.budgetAmount > 0)
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        budgeted: cat.budgetAmount || 0,
        spent: getCategorySpending(cat.id),
        color: cat.color,
      }))
  }, [state.categories, getCategorySpending])

  const totalBudgeted = budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0)
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0)

  // Calculate days remaining in the month
  const now = new Date()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysRemaining = lastDayOfMonth - now.getDate()

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Budget</h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • {daysRemaining} days remaining
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Overview Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Budgeted</p>
              <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
                ${totalBudgeted.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Spent</p>
              <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
                ${totalSpent.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Remaining</p>
              <p className={`text-2xl font-bold tabular-nums ${totalBudgeted - totalSpent >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                ${(totalBudgeted - totalSpent).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Cards */}
      {budgetCategories.length > 0 ? (
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {budgetCategories.map((category) => {
            const percentage = category.budgeted > 0 ? Math.round((category.spent / category.budgeted) * 100) : 0
            const isOverBudget = category.spent > category.budgeted

            return (
              <motion.div key={category.id} variants={staggerItem}>
                <Card className="transition-all hover:border-[var(--color-accent)] cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.name}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isOverBudget ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-secondary)]'
                        }`}
                      >
                        {percentage}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 h-2 rounded-full bg-[var(--color-background-secondary)]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: isOverBudget ? 'var(--color-danger)' : category.color,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-secondary)]">
                        ${category.spent.toLocaleString()} spent
                      </span>
                      <span className="text-[var(--color-text-muted)]">
                        of ${category.budgeted.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/10 mb-4">
              <Wallet className="h-8 w-8 text-[var(--color-accent)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              No budget categories yet
            </h3>
            <p className="text-[var(--color-text-secondary)] text-center mb-6 max-w-sm">
              Create budget categories to track your spending and stay on top of your finances.
            </p>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Your First Category
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Category Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Budget Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Budget categories are managed through your account settings. You can edit existing categories or create new ones there.
            </p>
            <Button asChild className="w-full">
              <a href="/settings">Go to Settings</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
