import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, TrendingUp, Wallet, Target, AlertTriangle } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'
export function Retirement() {

  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(65)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [currentSavings, setCurrentSavings] = useState(50000)
  const [expectedReturn, setExpectedReturn] = useState(7)
  const [inflationRate] = useState(3)

  // Calculate projected retirement savings
  const projectionData = useMemo(() => {
    const years = retirementAge - currentAge
    const monthlyRate = expectedReturn / 100 / 12
    const data = []

    let balance = currentSavings

    for (let year = 0; year <= years; year++) {
      data.push({
        age: currentAge + year,
        balance: Math.round(balance),
        contributions: currentSavings + (monthlyContribution * 12 * year),
      })

      // Compound monthly for a year
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + monthlyRate) + monthlyContribution
      }
    }

    return data
  }, [currentAge, retirementAge, monthlyContribution, currentSavings, expectedReturn])

  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0
  const totalContributions = currentSavings + (monthlyContribution * 12 * (retirementAge - currentAge))
  const investmentGains = finalBalance - totalContributions

  // Calculate monthly retirement income (4% rule)
  const monthlyRetirementIncome = (finalBalance * 0.04) / 12

  // Inflation-adjusted value
  const yearsToRetirement = retirementAge - currentAge
  const inflationFactor = Math.pow(1 + inflationRate / 100, yearsToRetirement)
  const realValue = finalBalance / inflationFactor

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 shadow-lg">
          <p className="text-xs text-[var(--color-text-muted)]">Age {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-medium text-[var(--color-text-primary)]">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Retirement readiness score
  const retirementScore = useMemo(() => {
    // Target: 25x annual expenses (assuming $50k/year expenses)
    const targetNestEgg = 50000 * 25 // $1.25M
    const score = Math.min(100, (finalBalance / targetNestEgg) * 100)
    return {
      score: Math.round(score),
      status: score >= 100 ? 'On Track' : score >= 75 ? 'Good Progress' : score >= 50 ? 'Needs Attention' : 'Behind',
      color: score >= 100 ? 'var(--color-success)' : score >= 75 ? 'var(--color-accent)' : score >= 50 ? 'var(--color-warning)' : 'var(--color-danger)',
    }
  }, [finalBalance])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Retirement Planning</h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Plan your financial future
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10">
                <Target className="h-5 w-5 text-[var(--color-accent)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Projected Nest Egg</p>
                <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
                  {formatCurrency(finalBalance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-success)]/10">
                <Wallet className="h-5 w-5 text-[var(--color-success)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Monthly Income</p>
                <p className="text-2xl font-bold tabular-nums text-[var(--color-success)]">
                  {formatCurrency(monthlyRetirementIncome)}
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
                <p className="text-sm text-[var(--color-text-secondary)]">Investment Gains</p>
                <p className="text-2xl font-bold tabular-nums text-[var(--color-accent-2)]">
                  {formatCurrency(investmentGains)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${retirementScore.color}20` }}>
                <Calendar className="h-5 w-5" style={{ color: retirementScore.color }} />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Years to Retire</p>
                <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
                  {yearsToRetirement}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <motion.div
        className="grid gap-6 lg:grid-cols-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Projection Chart */}
        <motion.div variants={staggerItem} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Growth Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis
                      dataKey="age"
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--color-border)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      name="Balance"
                      stroke="var(--color-accent)"
                      fill="url(#balanceGradient)"
                      strokeWidth={2}
                      animationBegin={0}
                      animationDuration={800}
                    />
                    <Line
                      type="monotone"
                      dataKey="contributions"
                      name="Contributions"
                      stroke="var(--color-text-muted)"
                      strokeDasharray="5 5"
                      dot={false}
                      animationBegin={0}
                      animationDuration={800}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Retirement Score */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Retirement Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <svg className="h-32 w-32 -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="var(--color-background-secondary)"
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke={retirementScore.color}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - retirementScore.score / 100) }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold tabular-nums" style={{ color: retirementScore.color }}>
                      {retirementScore.score}%
                    </span>
                  </div>
                </div>
                <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {retirementScore.status}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)] text-center">
                  Based on $50k/year retirement expenses
                </p>

                <div className="mt-6 w-full space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">Today's Value</span>
                    <span className="font-medium tabular-nums">{formatCurrency(realValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">Total Contributions</span>
                    <span className="font-medium tabular-nums">{formatCurrency(totalContributions)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Calculator */}
        <motion.div variants={staggerItem} className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Retirement Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Current Age</label>
                  <input
                    type="range"
                    min="18"
                    max="70"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(parseInt(e.target.value))}
                    className="mt-2 w-full"
                  />
                  <div className="mt-1 flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">18</span>
                    <span className="font-semibold text-[var(--color-accent)]">{currentAge}</span>
                    <span className="text-[var(--color-text-muted)]">70</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Retirement Age</label>
                  <input
                    type="range"
                    min={currentAge + 1}
                    max="80"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(parseInt(e.target.value))}
                    className="mt-2 w-full"
                  />
                  <div className="mt-1 flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">{currentAge + 1}</span>
                    <span className="font-semibold text-[var(--color-accent)]">{retirementAge}</span>
                    <span className="text-[var(--color-text-muted)]">80</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Current Savings</label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">$</span>
                    <input
                      type="text"
                      value={currentSavings.toLocaleString()}
                      onChange={(e) => setCurrentSavings(parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2 pl-8 pr-4 text-sm tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Monthly Contribution</label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">$</span>
                    <input
                      type="text"
                      value={monthlyContribution.toLocaleString()}
                      onChange={(e) => setMonthlyContribution(parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2 pl-8 pr-4 text-sm tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Expected Return</label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.5"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
                    className="mt-2 w-full"
                  />
                  <div className="mt-1 flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">1%</span>
                    <span className="font-semibold text-[var(--color-accent)]">{expectedReturn}%</span>
                    <span className="text-[var(--color-text-muted)]">12%</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              {retirementScore.score < 75 && (
                <div className="mt-6 flex items-start gap-3 rounded-lg bg-[var(--color-warning)]/10 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--color-warning)]" />
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">Consider increasing your contributions</p>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      Adding an extra ${Math.round((500 - monthlyContribution) / 100) * 100} per month could significantly improve your retirement outlook.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
