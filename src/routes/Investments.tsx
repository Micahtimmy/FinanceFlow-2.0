import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, TrendingUp, TrendingDown, Briefcase, BarChart3 } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'

interface Investment {
  id: string
  name: string
  type: 'stock' | 'etf' | 'crypto' | 'bond' | 'reit' | 'other'
  symbol?: string
  shares: number
  costBasis: number
  currentValue: number
  lastUpdated: Date
}

const sampleInvestments: Investment[] = [
  {
    id: '1',
    name: 'S&P 500 Index Fund',
    type: 'etf',
    symbol: 'VOO',
    shares: 25,
    costBasis: 9500,
    currentValue: 11250,
    lastUpdated: new Date(),
  },
  {
    id: '2',
    name: 'Apple Inc.',
    type: 'stock',
    symbol: 'AAPL',
    shares: 50,
    costBasis: 7500,
    currentValue: 8750,
    lastUpdated: new Date(),
  },
  {
    id: '3',
    name: 'Bitcoin',
    type: 'crypto',
    symbol: 'BTC',
    shares: 0.15,
    costBasis: 5000,
    currentValue: 6300,
    lastUpdated: new Date(),
  },
  {
    id: '4',
    name: 'Total Bond Market',
    type: 'bond',
    symbol: 'BND',
    shares: 100,
    costBasis: 8000,
    currentValue: 7800,
    lastUpdated: new Date(),
  },
]

const performanceHistory = [
  { month: 'Nov', value: 28000 },
  { month: 'Dec', value: 29500 },
  { month: 'Jan', value: 31000 },
  { month: 'Feb', value: 30200 },
  { month: 'Mar', value: 32500 },
  { month: 'Apr', value: 34100 },
]

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export function Investments() {
  const [investments] = useState<Investment[]>(sampleInvestments)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalCost = investments.reduce((sum, inv) => sum + inv.costBasis, 0)
  const totalGain = totalValue - totalCost
  const totalGainPercent = ((totalGain / totalCost) * 100).toFixed(2)

  const allocationData = investments.map((inv, index) => ({
    name: inv.name,
    value: inv.currentValue,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getTypeIcon = (type: Investment['type']) => {
    const icons: Record<Investment['type'], string> = {
      stock: '📈',
      etf: '📊',
      crypto: '₿',
      bond: '🏦',
      reit: '🏢',
      other: '💼',
    }
    return icons[type]
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 shadow-lg">
          <p className="font-semibold tabular-nums text-[var(--color-text-primary)]">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Investments</h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            Track your investment portfolio
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Investment
        </Button>
      </div>

      {/* Portfolio Summary */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10">
                <Briefcase className="h-5 w-5 text-[var(--color-accent)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Total Value</p>
                <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
                  {formatCurrency(totalValue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  totalGain >= 0 ? 'bg-[var(--color-success)]/10' : 'bg-[var(--color-danger)]/10'
                }`}
              >
                {totalGain >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-[var(--color-success)]" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-[var(--color-danger)]" />
                )}
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Total Gain/Loss</p>
                <p
                  className={`text-2xl font-bold tabular-nums ${
                    totalGain >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                  }`}
                >
                  {totalGain >= 0 ? '+' : ''}
                  {formatCurrency(totalGain)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent-2)]/10">
                <BarChart3 className="h-5 w-5 text-[var(--color-accent-2)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Return %</p>
                <p
                  className={`text-2xl font-bold tabular-nums ${
                    totalGain >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                  }`}
                >
                  {totalGain >= 0 ? '+' : ''}
                  {totalGainPercent}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--color-text-secondary)]">Holdings</p>
            <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
              {investments.length}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">Active positions</p>
          </CardContent>
        </Card>
      </div>

      <motion.div
        className="grid gap-6 lg:grid-cols-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Performance Chart */}
        <motion.div variants={staggerItem} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceHistory}>
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-accent)"
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

        {/* Allocation */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="h-48 w-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 w-full space-y-2">
                  {allocationData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="flex-1 truncate text-sm text-[var(--color-text-secondary)]">
                        {item.name}
                      </span>
                      <span className="text-sm font-medium tabular-nums">
                        {((item.value / totalValue) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Holdings List */}
        <motion.div variants={staggerItem} className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investments.map((inv) => {
                  const gain = inv.currentValue - inv.costBasis
                  const gainPercent = ((gain / inv.costBasis) * 100).toFixed(2)

                  return (
                    <div
                      key={inv.id}
                      className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:bg-[var(--color-background-secondary)]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-background-secondary)] text-2xl">
                        {getTypeIcon(inv.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-[var(--color-text-primary)]">{inv.name}</p>
                          {inv.symbol && (
                            <span className="rounded bg-[var(--color-background-secondary)] px-1.5 py-0.5 text-xs font-medium text-[var(--color-text-muted)]">
                              {inv.symbol}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {inv.shares} shares @ {formatCurrency(inv.costBasis / inv.shares)}/share
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold tabular-nums text-[var(--color-text-primary)]">
                          {formatCurrency(inv.currentValue)}
                        </p>
                        <p
                          className={`text-sm tabular-nums ${
                            gain >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                          }`}
                        >
                          {gain >= 0 ? '+' : ''}
                          {formatCurrency(gain)} ({gainPercent}%)
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Add Investment Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Investment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Investment Name</label>
              <input
                type="text"
                placeholder="e.g., Apple Inc."
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Type</label>
                <select className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm">
                  <option value="stock">Stock</option>
                  <option value="etf">ETF</option>
                  <option value="crypto">Crypto</option>
                  <option value="bond">Bond</option>
                  <option value="reit">REIT</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Symbol (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., AAPL"
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Shares/Units</label>
                <input
                  type="text"
                  placeholder="0"
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Cost Basis</label>
                <input
                  type="text"
                  placeholder="$0.00"
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </div>
            </div>
            <Button className="w-full" onClick={() => setAddDialogOpen(false)}>
              Add Investment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
