import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, TrendingUp, Wallet, Target, DollarSign } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'

interface IncomeSource {
  id: string
  name: string
  type: 'salary' | 'freelance' | 'investment' | 'rental' | 'side-hustle' | 'other'
  amount: number
  frequency: 'monthly' | 'biweekly' | 'weekly' | 'irregular'
  isActive: boolean
}

const sampleIncomeSources: IncomeSource[] = [
  {
    id: '1',
    name: 'Software Engineer Salary',
    type: 'salary',
    amount: 7500,
    frequency: 'monthly',
    isActive: true,
  },
  {
    id: '2',
    name: 'Freelance Consulting',
    type: 'freelance',
    amount: 1500,
    frequency: 'irregular',
    isActive: true,
  },
  {
    id: '3',
    name: 'Dividend Income',
    type: 'investment',
    amount: 200,
    frequency: 'monthly',
    isActive: true,
  },
]

const monthlyIncomeHistory = [
  { month: 'Nov', primary: 7500, secondary: 1200 },
  { month: 'Dec', primary: 7500, secondary: 2100 },
  { month: 'Jan', primary: 7500, secondary: 800 },
  { month: 'Feb', primary: 7500, secondary: 1500 },
  { month: 'Mar', primary: 7500, secondary: 1800 },
  { month: 'Apr', primary: 7500, secondary: 1700 },
]

export function IncomeTracker() {
  const [incomeSources] = useState<IncomeSource[]>(sampleIncomeSources)
  const [incomeGoal] = useState(12000)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const totalMonthlyIncome = incomeSources
    .filter((s) => s.isActive)
    .reduce((sum, source) => {
      if (source.frequency === 'monthly') return sum + source.amount
      if (source.frequency === 'biweekly') return sum + source.amount * 2
      if (source.frequency === 'weekly') return sum + source.amount * 4
      return sum + source.amount // irregular - use as-is
    }, 0)

  const goalProgress = (totalMonthlyIncome / incomeGoal) * 100

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getTypeIcon = (type: IncomeSource['type']) => {
    const icons: Record<IncomeSource['type'], string> = {
      salary: '💼',
      freelance: '💻',
      investment: '📈',
      rental: '🏠',
      'side-hustle': '🚀',
      other: '💰',
    }
    return icons[type]
  }

  const getTypeLabel = (type: IncomeSource['type']) => {
    const labels: Record<IncomeSource['type'], string> = {
      salary: 'Salary',
      freelance: 'Freelance',
      investment: 'Investment',
      rental: 'Rental',
      'side-hustle': 'Side Hustle',
      other: 'Other',
    }
    return labels[type]
  }

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 shadow-lg">
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

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Income Tracker</h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            Track and grow your income streams
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Income Source
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-success)]/10">
                <Wallet className="h-5 w-5 text-[var(--color-success)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Monthly Income</p>
                <p className="text-2xl font-bold tabular-nums text-[var(--color-success)]">
                  {formatCurrency(totalMonthlyIncome)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10">
                <Target className="h-5 w-5 text-[var(--color-accent)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Income Goal</p>
                <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
                  {formatCurrency(incomeGoal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent-2)]/10">
                <TrendingUp className="h-5 w-5 text-[var(--color-accent-2)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Goal Progress</p>
                <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
                  {goalProgress.toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--color-text-secondary)]">Income Sources</p>
            <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
              {incomeSources.filter((s) => s.isActive).length}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">Active streams</p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Progress Bar */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-[var(--color-text-primary)]">Progress to Goal</span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {formatCurrency(totalMonthlyIncome)} / {formatCurrency(incomeGoal)}
            </span>
          </div>
          <div className="h-4 rounded-full bg-[var(--color-background-secondary)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(goalProgress, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          {goalProgress < 100 && (
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {formatCurrency(incomeGoal - totalMonthlyIncome)} more to reach your goal
            </p>
          )}
        </CardContent>
      </Card>

      <motion.div
        className="grid gap-6 lg:grid-cols-2"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Income History Chart */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Monthly Income History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyIncomeHistory} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
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
                    <Bar
                      dataKey="primary"
                      name="Primary"
                      fill="var(--color-success)"
                      radius={[4, 4, 0, 0]}
                      animationBegin={0}
                      animationDuration={800}
                    />
                    <Bar
                      dataKey="secondary"
                      name="Secondary"
                      fill="var(--color-accent)"
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

        {/* Income Sources List */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Income Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incomeSources.map((source) => (
                  <div
                    key={source.id}
                    className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                      source.isActive
                        ? 'border-[var(--color-border)] hover:bg-[var(--color-background-secondary)]'
                        : 'border-dashed border-[var(--color-border)] opacity-50'
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-background-secondary)] text-2xl">
                      {getTypeIcon(source.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--color-text-primary)]">{source.name}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {getTypeLabel(source.type)} • {source.frequency}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold tabular-nums text-[var(--color-success)]">
                        {formatCurrency(source.amount)}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        /{source.frequency === 'monthly' ? 'mo' : source.frequency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Add Income Source Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Income Source</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Source Name</label>
              <input
                type="text"
                placeholder="e.g., Freelance Writing"
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Type</label>
                <select className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm">
                  <option value="salary">Salary</option>
                  <option value="freelance">Freelance</option>
                  <option value="investment">Investment</option>
                  <option value="rental">Rental</option>
                  <option value="side-hustle">Side Hustle</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Frequency</label>
                <select className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm">
                  <option value="monthly">Monthly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="weekly">Weekly</option>
                  <option value="irregular">Irregular</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Amount</label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="0.00"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2 pl-9 pr-4 text-sm tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </div>
            </div>
            <Button className="w-full" onClick={() => setAddDialogOpen(false)}>
              Add Income Source
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
