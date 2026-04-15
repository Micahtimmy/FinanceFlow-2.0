import { useState, useMemo } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { generatePulseHistory, getScoreColor } from '@/lib/financial-pulse'
import { useUser } from '@/context/UserContext'
import { RemindersWidget } from '@/components/dashboard'
import { Plus, CreditCard, ArrowRightLeft, BarChart3, Sparkles } from 'lucide-react'

function AnimatedNumber({ value, duration = 1 }: { value: number; duration?: number }) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: duration * 1000 })
  const displayValue = useTransform(springValue, (v) => Math.round(v))

  useState(() => {
    motionValue.set(value)
  })

  return <motion.span>{displayValue}</motion.span>
}

export function Dashboard() {
  const {
    state,
    getPulseScore,
    getTotalBudget,
    getTotalSpent,
    getRecentTransactions,
    getUpcomingBills,
  } = useUser()

  const pulseScore = getPulseScore()
  const totalBudget = getTotalBudget()
  const totalSpent = getTotalSpent()
  const recentTransactions = getRecentTransactions(5)
  const upcomingBills = getUpcomingBills(7)

  // Generate pulse history for sparkline
  const pulseHistory = useMemo(
    () => generatePulseHistory(pulseScore.score, 30),
    [pulseScore.score]
  )

  // Calculate stroke offset for progress ring
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (pulseScore.score / 100) * circumference

  // Quick Action dialogs
  const [addTransactionOpen, setAddTransactionOpen] = useState(false)
  const [addBillOpen, setAddBillOpen] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const now = new Date()
    const diffTime = d.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `In ${diffDays} days`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      {/* Quick Action Bar */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Dialog open={addTransactionOpen} onOpenChange={setAddTransactionOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Merchant</label>
                <input
                  type="text"
                  placeholder="e.g., Grocery Store"
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Amount</label>
                <input
                  type="text"
                  placeholder="0.00"
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Category</label>
                <select className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20">
                  {state.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button className="w-full" onClick={() => setAddTransactionOpen(false)}>
                Add Transaction
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={addBillOpen} onOpenChange={setAddBillOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Add Bill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Bill Name</label>
                <input
                  type="text"
                  placeholder="e.g., Netflix"
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Amount</label>
                <input
                  type="text"
                  placeholder="0.00"
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Due Date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </div>
              <Button className="w-full" onClick={() => setAddBillOpen(false)}>
                Add Bill
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" className="gap-2">
          <ArrowRightLeft className="h-4 w-4" />
          Transfer to Savings
        </Button>

        <Button variant="outline" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          View Reports
        </Button>
      </div>

      {/* Pulse Score Hero */}
      <Card className="mb-8 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              {/* Score Circle */}
              <div className="relative">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="var(--color-border)"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={getScoreColor(pulseScore.color)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className="text-4xl font-bold tabular-nums text-[var(--color-text-primary)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <AnimatedNumber value={pulseScore.score} />
                  </motion.span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                  Financial Pulse
                </h2>
                <p className="font-medium" style={{ color: getScoreColor(pulseScore.color) }}>
                  {pulseScore.grade}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent)]">
                    Budget: {pulseScore.breakdown.budgetScore}/40
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[var(--color-success)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-success)]">
                    Savings: {pulseScore.breakdown.savingsScore}/30
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[var(--color-accent-2)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent-2)]">
                    Cash Flow: {pulseScore.breakdown.cashFlowScore}/30
                  </span>
                </div>
              </div>
            </div>

            {/* Sparkline */}
            <div className="h-16 w-full md:w-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pulseHistory}>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 shadow-lg backdrop-blur-sm">
                            <p className="text-xs text-[var(--color-text-muted)]">
                              {payload[0].payload.date}
                            </p>
                            <p className="font-semibold tabular-nums text-[var(--color-text-primary)]">
                              Score: {payload[0].value}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={getScoreColor(pulseScore.color)}
                    strokeWidth={2}
                    dot={false}
                    animationBegin={0}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Grid */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Budget Overview */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Monthly Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
                    {formatCurrency(totalSpent)}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    of {formatCurrency(totalBudget)} spent
                  </p>
                </div>
                <div className="relative h-20 w-20">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="var(--color-border)"
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={251}
                      initial={{ strokeDashoffset: 251 }}
                      animate={{
                        strokeDashoffset: 251 - (Math.min(totalSpent / totalBudget, 1) * 251),
                      }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold tabular-nums">
                      {Math.round((totalSpent / totalBudget) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Savings Progress */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Savings Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.savingsGoals.slice(0, 2).map((goal) => {
                const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100)
                return (
                  <div key={goal.id}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-[var(--color-text-secondary)]">{goal.name}</span>
                      <span className="font-medium tabular-nums">{percentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--color-background-secondary)]">
                      <motion.div
                        className="h-full rounded-full bg-[var(--color-success)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx) => {
                  const category = state.categories.find((c) => c.id === tx.categoryId)
                  return (
                    <div key={tx.id} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-background-secondary)] text-sm font-medium">
                        {category?.icon || tx.merchantName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                          {tx.merchantName}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {category?.name || 'Uncategorized'}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium tabular-nums ${
                          tx.type === 'income'
                            ? 'text-[var(--color-success)]'
                            : 'text-[var(--color-text-primary)]'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bills Due */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Upcoming Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingBills.length > 0 ? (
                  upcomingBills.slice(0, 3).map((bill) => {
                    const dueDate = new Date(bill.dueDate)
                    const now = new Date()
                    const diffDays = Math.ceil(
                      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                    )
                    const urgent = diffDays <= 2

                    return (
                      <div key={bill.id} className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            urgent ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-warning)]'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">
                            {bill.name}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {formatDate(dueDate)}
                          </p>
                        </div>
                        <span className="text-sm font-medium tabular-nums text-[var(--color-text-primary)]">
                          {formatCurrency(bill.amount)}
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-[var(--color-text-muted)]">No bills due soon</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Net Worth Trend */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Net Worth</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
                {formatCurrency(67250)}
              </p>
              <p className="text-sm text-[var(--color-success)]">+$1,200 this month</p>
              <div className="mt-4 h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Nov', value: 58000 },
                      { month: 'Dec', value: 60500 },
                      { month: 'Jan', value: 62000 },
                      { month: 'Feb', value: 64200 },
                      { month: 'Mar', value: 66050 },
                      { month: 'Apr', value: 67250 },
                    ]}
                  >
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 shadow-lg backdrop-blur-sm">
                              <p className="text-xs text-[var(--color-text-muted)]">
                                {payload[0].payload.month}
                              </p>
                              <p className="font-semibold tabular-nums text-[var(--color-text-primary)]">
                                {formatCurrency(payload[0].value as number)}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-success)"
                      strokeWidth={2}
                      dot={false}
                      animationBegin={0}
                      animationDuration={800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                AI Insights
                <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="rounded-lg border-l-2 border-[var(--color-warning)] bg-[var(--color-warning)]/5 p-3">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    Dining budget at 80%
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    12 days left in the month
                  </p>
                </div>
                <div className="rounded-lg border-l-2 border-[var(--color-success)] bg-[var(--color-success)]/5 p-3">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    Great savings streak!
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    3 weeks consistent saving
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reminders Widget */}
        <motion.div variants={staggerItem}>
          <RemindersWidget />
        </motion.div>
      </motion.div>
    </div>
  )
}
