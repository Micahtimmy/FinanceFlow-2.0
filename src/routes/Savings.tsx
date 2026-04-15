import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Target, PiggyBank } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { useUser } from '@/context/UserContext'

const goalColors = [
  'var(--color-success)',
  'var(--color-accent)',
  'var(--color-accent-2)',
  'var(--color-accent-3)',
  'var(--color-warning)',
]

export function Savings() {
  const { state } = useUser()
  const savingsGoals = state.savingsGoals

  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalTargets = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Savings Goals</h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            Track your progress towards financial goals
          </p>
        </div>
        <Button asChild>
          <Link to="/savings/new">
            <Plus className="h-4 w-4" />
            New Goal
          </Link>
        </Button>
      </div>

      {/* Overview */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Saved</p>
              <p className="text-3xl font-bold tabular-nums gradient-text">
                ${totalSaved.toLocaleString()}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                of ${totalTargets.toLocaleString()} total goals
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline">Transfer Money</Button>
              <Button variant="outline">View History</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Grid */}
      {savingsGoals.length > 0 ? (
        <motion.div
          className="grid gap-6 md:grid-cols-2"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {savingsGoals.map((goal, index) => {
            const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100)
            const remaining = goal.targetAmount - goal.currentAmount
            const color = goalColors[index % goalColors.length]

            return (
              <motion.div key={goal.id} variants={staggerItem}>
                <Card className="transition-all hover:border-[var(--color-accent)]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5" style={{ color }} />
                      {goal.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="mb-2 flex justify-between">
                        <span className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
                          ${goal.currentAmount.toLocaleString()}
                        </span>
                        <span className="text-lg font-medium text-[var(--color-text-muted)]">
                          ${goal.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-[var(--color-background-secondary)]">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentage, 100)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-secondary)]">{percentage}% complete</span>
                      <span className="text-[var(--color-text-muted)]">
                        ${remaining.toLocaleString()} to go
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
              <PiggyBank className="h-8 w-8 text-[var(--color-accent)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              No savings goals yet
            </h3>
            <p className="text-[var(--color-text-secondary)] text-center mb-6 max-w-sm">
              Start saving towards something meaningful. Create your first goal and watch your progress grow.
            </p>
            <Button asChild>
              <Link to="/savings/new">
                <Plus className="h-4 w-4" />
                Create Your First Goal
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
