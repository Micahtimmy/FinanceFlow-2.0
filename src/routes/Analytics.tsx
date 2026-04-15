import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '@/context/UserContext'
import { staggerContainer, staggerItem } from '@/lib/animations'

const CHART_COLORS = [
  '#6366f1', // accent
  '#a855f7', // accent-2
  '#ec4899', // accent-3
  '#10b981', // success
  '#f59e0b', // warning
  '#ef4444', // danger
  '#8b5cf6',
  '#06b6d4',
]

export function Analytics() {
  const { state, getCategorySpending } = useUser()

  // Calculate spending by category for current month
  const categorySpendingData = useMemo(() => {
    return state.categories
      .filter((cat) => cat.budgetAmount)
      .map((cat, index) => ({
        name: cat.name,
        value: getCategorySpending(cat.id),
        color: CHART_COLORS[index % CHART_COLORS.length],
        icon: cat.icon,
      }))
      .filter((cat) => cat.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [state.categories, getCategorySpending])

  // Monthly spending trend (last 6 months)
  const monthlyTrendData = useMemo(() => {
    const months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const income = state.transactions
        .filter(
          (tx) =>
            tx.type === 'income' &&
            new Date(tx.date) >= date &&
            new Date(tx.date) <= monthEnd
        )
        .reduce((sum, tx) => sum + tx.amount, 0)

      const expenses = state.transactions
        .filter(
          (tx) =>
            tx.type === 'expense' &&
            new Date(tx.date) >= date &&
            new Date(tx.date) <= monthEnd
        )
        .reduce((sum, tx) => sum + tx.amount, 0)

      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        income,
        expenses,
      })
    }

    return months
  }, [state.transactions])

  // Top merchants
  const topMerchants = useMemo(() => {
    const merchantSpending: Record<string, { amount: number; count: number }> = {}

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    state.transactions
      .filter((tx) => tx.type === 'expense' && new Date(tx.date) >= startOfMonth)
      .forEach((tx) => {
        if (!merchantSpending[tx.merchantName]) {
          merchantSpending[tx.merchantName] = { amount: 0, count: 0 }
        }
        merchantSpending[tx.merchantName].amount += tx.amount
        merchantSpending[tx.merchantName].count++
      })

    return Object.entries(merchantSpending)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }, [state.transactions])

  // Calculate totals for income vs expenses
  const monthlyTotals = useMemo(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const income = state.transactions
      .filter((tx) => tx.type === 'income' && new Date(tx.date) >= startOfMonth)
      .reduce((sum, tx) => sum + tx.amount, 0)

    const expenses = state.transactions
      .filter((tx) => tx.type === 'expense' && new Date(tx.date) >= startOfMonth)
      .reduce((sum, tx) => sum + tx.amount, 0)

    return { income, expenses, net: income - expenses }
  }, [state.transactions])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 shadow-lg backdrop-blur-sm">
          <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { color: string } }[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 shadow-lg backdrop-blur-sm">
          <p className="font-medium text-[var(--color-text-primary)]">{data.name}</p>
          <p className="text-sm tabular-nums" style={{ color: data.payload.color }}>
            {formatCurrency(data.value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Understand your spending patterns
        </p>
      </div>

      <motion.div
        className="grid gap-6 lg:grid-cols-2"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Spending by Category */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categorySpendingData.length > 0 ? (
                <div className="flex flex-col items-center gap-4 lg:flex-row">
                  <div className="h-64 w-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categorySpendingData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {categorySpendingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {categorySpendingData.slice(0, 5).map((category) => (
                      <div key={category.name} className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="flex-1 text-sm text-[var(--color-text-secondary)]">
                          {category.icon} {category.name}
                        </span>
                        <span className="text-sm font-medium tabular-nums text-[var(--color-text-primary)]">
                          {formatCurrency(category.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-[var(--color-text-muted)]">No spending data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Spending Trend */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Monthly Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendData} barGap={2}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--color-border)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: 12 }}
                      iconType="circle"
                      iconSize={8}
                    />
                    <Bar
                      dataKey="income"
                      name="Income"
                      fill="var(--color-success)"
                      radius={[4, 4, 0, 0]}
                      animationBegin={0}
                      animationDuration={800}
                    />
                    <Bar
                      dataKey="expenses"
                      name="Expenses"
                      fill="var(--color-danger)"
                      radius={[4, 4, 0, 0]}
                      animationBegin={0}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Merchants */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Top Merchants</CardTitle>
            </CardHeader>
            <CardContent>
              {topMerchants.length > 0 ? (
                <div className="space-y-4">
                  {topMerchants.map((merchant) => (
                    <div key={merchant.name} className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-background-secondary)] text-sm font-medium">
                        {merchant.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[var(--color-text-primary)]">
                          {merchant.name}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {merchant.count} transaction{merchant.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className="font-semibold tabular-nums text-[var(--color-text-primary)]">
                        {formatCurrency(merchant.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-[var(--color-text-muted)]">No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Income vs Expenses */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Income</span>
                    <span className="font-semibold tabular-nums text-[var(--color-success)]">
                      {formatCurrency(monthlyTotals.income)}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[var(--color-background-secondary)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--color-success)]"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Expenses</span>
                    <span className="font-semibold tabular-nums text-[var(--color-danger)]">
                      {formatCurrency(monthlyTotals.expenses)}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[var(--color-background-secondary)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--color-danger)]"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${monthlyTotals.income > 0 ? (monthlyTotals.expenses / monthlyTotals.income) * 100 : 0}%`,
                      }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </div>
                </div>
                <div className="border-t border-[var(--color-border)] pt-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-[var(--color-text-primary)]">
                      Net Cash Flow
                    </span>
                    <span
                      className={`font-bold tabular-nums ${
                        monthlyTotals.net >= 0
                          ? 'text-[var(--color-success)]'
                          : 'text-[var(--color-danger)]'
                      }`}
                    >
                      {monthlyTotals.net >= 0 ? '+' : ''}
                      {formatCurrency(monthlyTotals.net)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
