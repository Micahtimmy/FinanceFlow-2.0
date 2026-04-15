import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'

const assets = [
  { name: 'Checking Account', value: 8500, type: 'Cash' },
  { name: 'Savings Account', value: 24200, type: 'Cash' },
  { name: 'Investment Portfolio', value: 35000, type: 'Investments' },
  { name: 'Retirement (401k)', value: 42000, type: 'Retirement' },
]

const liabilities = [
  { name: 'Credit Card', value: 2450, type: 'Credit' },
  { name: 'Car Loan', value: 12000, type: 'Loan' },
  { name: 'Student Loans', value: 28000, type: 'Loan' },
]

export function NetWorth() {
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0)
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0)
  const netWorth = totalAssets - totalLiabilities

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Net Worth</h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            Track your assets and liabilities
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      {/* Net Worth Hero */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">Total Net Worth</p>
            <p className="text-5xl font-bold tabular-nums gradient-text">
              ${netWorth.toLocaleString()}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-[var(--color-success)]">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">+$2,340 this month</span>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="text-center p-4 rounded-lg bg-[var(--color-success)]/10">
              <p className="text-sm text-[var(--color-text-secondary)]">Total Assets</p>
              <p className="text-2xl font-bold tabular-nums text-[var(--color-success)]">
                ${totalAssets.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--color-danger)]/10">
              <p className="text-sm text-[var(--color-text-secondary)]">Total Liabilities</p>
              <p className="text-2xl font-bold tabular-nums text-[var(--color-danger)]">
                ${totalLiabilities.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-[var(--color-success)]" />
              Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assets.map((asset, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-background-secondary)] transition-colors"
                >
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">{asset.name}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{asset.type}</p>
                  </div>
                  <span className="font-semibold tabular-nums text-[var(--color-success)]">
                    ${asset.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Liabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingDown className="h-4 w-4 text-[var(--color-danger)]" />
              Liabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liabilities.map((liability, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-background-secondary)] transition-colors"
                >
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">{liability.name}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{liability.type}</p>
                  </div>
                  <span className="font-semibold tabular-nums text-[var(--color-danger)]">
                    -${liability.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
