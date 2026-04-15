import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calculator } from 'lucide-react'

const debts = [
  { name: 'Credit Card', balance: 2450, apr: 19.99, minPayment: 75, type: 'Credit Card' },
  { name: 'Car Loan', balance: 12000, apr: 5.9, minPayment: 350, type: 'Auto Loan' },
  { name: 'Student Loans', balance: 28000, apr: 4.5, minPayment: 280, type: 'Student Loan' },
]

export function DebtTracker() {
  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0)
  const totalMinPayment = debts.reduce((sum, d) => sum + d.minPayment, 0)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Debt Tracker</h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            Create a plan to eliminate your debt
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Debt
        </Button>
      </div>

      {/* Summary */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--color-text-secondary)]">Total Debt</p>
            <p className="text-2xl font-bold tabular-nums text-[var(--color-danger)]">
              ${totalDebt.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--color-text-secondary)]">Monthly Minimum</p>
            <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
              ${totalMinPayment}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--color-text-secondary)]">Debt-Free Date</p>
            <p className="text-2xl font-bold text-[var(--color-success)]">Mar 2029</p>
            <p className="text-sm text-[var(--color-text-muted)]">at minimum payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Payoff Strategy */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="h-4 w-4" />
            Payoff Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="default">Avalanche (Highest APR)</Button>
            <Button variant="outline">Snowball (Lowest Balance)</Button>
          </div>
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
            The avalanche method saves you the most money by targeting high-interest debt first.
          </p>
        </CardContent>
      </Card>

      {/* Debts List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Debts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {debts.map((debt, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">{debt.name}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{debt.type}</p>
                  </div>
                  <span className="text-xl font-bold tabular-nums text-[var(--color-danger)]">
                    ${debt.balance.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-[var(--color-text-muted)]">APR: </span>
                    <span className="font-medium text-[var(--color-text-primary)]">{debt.apr}%</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-muted)]">Min Payment: </span>
                    <span className="font-medium text-[var(--color-text-primary)]">${debt.minPayment}/mo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
