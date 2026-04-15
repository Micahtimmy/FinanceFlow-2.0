import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useOnboarding, type GoalId } from '@/context/OnboardingContext'

interface BudgetCategory {
  name: string
  amount: string
}

interface SavingsGoalData {
  name: string
  targetAmount: string
  targetDate: string
}

interface DebtData {
  name: string
  balance: string
  apr: string
  minPayment: string
}

export function FirstAction() {
  const navigate = useNavigate()
  const { state, setFirstActionData, setStep, getSelectedGoalDetails } = useOnboarding()
  const goalDetails = getSelectedGoalDetails()

  // State for different goal types
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([
    { name: 'Housing', amount: '' },
    { name: 'Food & Dining', amount: '' },
    { name: 'Transportation', amount: '' },
  ])

  const [savingsGoal, setSavingsGoal] = useState<SavingsGoalData>({
    name: '',
    targetAmount: '',
    targetDate: '',
  })

  const [debt, setDebt] = useState<DebtData>({
    name: '',
    balance: '',
    apr: '',
    minPayment: '',
  })

  const [investmentTypes, setInvestmentTypes] = useState<string[]>([])
  const [assetName, setAssetName] = useState('')
  const [assetType, setAssetType] = useState('cash')
  const [assetValue, setAssetValue] = useState('')
  const [incomeGoal, setIncomeGoal] = useState('')
  const [retirementAge, setRetirementAge] = useState(65)
  const [billName, setBillName] = useState('')
  const [billAmount, setBillAmount] = useState('')
  const [billDueDate, setBillDueDate] = useState('')
  const [overspendCategory, setOverspendCategory] = useState('')

  const emergencyFundTarget = state.monthlyIncome * 3

  const handleContinue = () => {
    const data: Record<string, unknown> = {}

    switch (state.selectedGoal) {
      case 'budget':
        data.budgetCategories = budgetCategories
        break
      case 'save':
        data.savingsGoal = savingsGoal
        break
      case 'debt':
        data.debt = debt
        break
      case 'invest':
        data.investmentTypes = investmentTypes
        break
      case 'net-worth':
        data.asset = { name: assetName, type: assetType, value: assetValue }
        break
      case 'emergency-fund':
        data.emergencyFundTarget = emergencyFundTarget
        break
      case 'income':
        data.incomeGoal = incomeGoal
        break
      case 'retire':
        data.retirementAge = retirementAge
        break
      case 'bills':
        data.bill = { name: billName, amount: billAmount, dueDate: billDueDate }
        break
      case 'spending':
        data.overspendCategory = overspendCategory
        break
    }

    setFirstActionData(data)
    setStep(4)
    navigate('/onboarding/complete')
  }

  const handleBack = () => {
    navigate('/onboarding/profile')
  }

  const renderGoalContent = (goalId: GoalId | null) => {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: state.primaryCurrency,
        minimumFractionDigits: 0,
      }).format(value)
    }

    switch (goalId) {
      case 'budget':
        return (
          <div className="space-y-4">
            <p className="text-[var(--color-text-secondary)]">
              Create your first budget categories to start tracking spending.
            </p>
            {budgetCategories.map((cat, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => {
                    const updated = [...budgetCategories]
                    updated[index].name = e.target.value
                    setBudgetCategories(updated)
                  }}
                  placeholder="Category name"
                  className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
                <input
                  type="text"
                  value={cat.amount}
                  onChange={(e) => {
                    const updated = [...budgetCategories]
                    updated[index].amount = e.target.value.replace(/[^0-9]/g, '')
                    setBudgetCategories(updated)
                  }}
                  placeholder="Budget amount"
                  className="w-32 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
                {budgetCategories.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setBudgetCategories(budgetCategories.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4 text-[var(--color-text-muted)]" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setBudgetCategories([...budgetCategories, { name: '', amount: '' }])}
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        )

      case 'save':
        return (
          <div className="space-y-4">
            <p className="text-[var(--color-text-secondary)]">
              Name your first savings goal and set a target.
            </p>
            <input
              type="text"
              value={savingsGoal.name}
              onChange={(e) => setSavingsGoal({ ...savingsGoal, name: e.target.value })}
              placeholder="Goal name (e.g., Vacation, New Car)"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
            <input
              type="text"
              value={savingsGoal.targetAmount}
              onChange={(e) =>
                setSavingsGoal({ ...savingsGoal, targetAmount: e.target.value.replace(/[^0-9]/g, '') })
              }
              placeholder="Target amount"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
            <input
              type="date"
              value={savingsGoal.targetDate}
              onChange={(e) => setSavingsGoal({ ...savingsGoal, targetDate: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
          </div>
        )

      case 'debt':
        return (
          <div className="space-y-4">
            <p className="text-[var(--color-text-secondary)]">Add your first debt to start tracking payoff.</p>
            <input
              type="text"
              value={debt.name}
              onChange={(e) => setDebt({ ...debt, name: e.target.value })}
              placeholder="Debt name (e.g., Credit Card, Car Loan)"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <input
                type="text"
                value={debt.balance}
                onChange={(e) => setDebt({ ...debt, balance: e.target.value.replace(/[^0-9]/g, '') })}
                placeholder="Balance"
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
              <input
                type="text"
                value={debt.apr}
                onChange={(e) => setDebt({ ...debt, apr: e.target.value.replace(/[^0-9.]/g, '') })}
                placeholder="APR %"
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
              <input
                type="text"
                value={debt.minPayment}
                onChange={(e) => setDebt({ ...debt, minPayment: e.target.value.replace(/[^0-9]/g, '') })}
                placeholder="Min. payment"
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
            </div>
          </div>
        )

      case 'invest':
        return (
          <div className="space-y-4">
            <p className="text-[var(--color-text-secondary)]">What are you investing in?</p>
            {['Stocks', 'ETFs', 'Crypto', 'Real Estate', 'Other'].map((type) => (
              <label
                key={type}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                  investmentTypes.includes(type)
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                    : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={investmentTypes.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setInvestmentTypes([...investmentTypes, type])
                    } else {
                      setInvestmentTypes(investmentTypes.filter((t) => t !== type))
                    }
                  }}
                  className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                <span className="text-[var(--color-text-primary)]">{type}</span>
              </label>
            ))}
          </div>
        )

      case 'net-worth':
        return (
          <div className="space-y-4">
            <p className="text-[var(--color-text-secondary)]">Add your first asset to start tracking net worth.</p>
            <input
              type="text"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="Asset name (e.g., Checking Account)"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            >
              <option value="cash">Cash / Bank Account</option>
              <option value="investment">Investment Account</option>
              <option value="retirement">Retirement Account</option>
              <option value="property">Property</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              value={assetValue}
              onChange={(e) => setAssetValue(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Estimated value"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
          </div>
        )

      case 'emergency-fund':
        return (
          <div className="space-y-4">
            <p className="text-[var(--color-text-secondary)]">
              Based on your income, here's your recommended emergency fund target:
            </p>
            <Card className="border-[var(--color-accent)] bg-[var(--color-accent)]/5">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-[var(--color-text-secondary)]">Target: 3 months of expenses</p>
                <p className="mt-2 text-4xl font-bold gradient-text">{formatCurrency(emergencyFundTarget)}</p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Based on {formatCurrency(state.monthlyIncome)} monthly income
                </p>
              </CardContent>
            </Card>
            <p className="text-sm text-[var(--color-text-muted)]">
              Financial experts recommend saving 3-6 months of expenses. We'll start with 3 months.
            </p>
          </div>
        )

      case 'income':
        return (
          <div className="space-y-4">
            <p className="text-[var(--color-text-secondary)]">Set your monthly income goal.</p>
            <input
              type="text"
              value={incomeGoal}
              onChange={(e) => setIncomeGoal(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Target monthly income"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
            <p className="text-sm text-[var(--color-text-muted)]">
              Current income: {formatCurrency(state.monthlyIncome)}/month
            </p>
          </div>
        )

      case 'retire':
        return (
          <div className="space-y-4">
            <p className="text-[var(--color-text-secondary)]">When do you want to retire?</p>
            <div className="py-4">
              <input
                type="range"
                min={50}
                max={75}
                value={retirementAge}
                onChange={(e) => setRetirementAge(parseInt(e.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
              <div className="mt-4 flex justify-between text-sm text-[var(--color-text-muted)]">
                <span>50</span>
                <span className="text-2xl font-bold text-[var(--color-accent)]">{retirementAge}</span>
                <span>75</span>
              </div>
            </div>
          </div>
        )

      case 'bills':
        return (
          <div className="space-y-4">
            <p className="text-[var(--color-text-secondary)]">Add your first recurring bill.</p>
            <input
              type="text"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              placeholder="Bill name (e.g., Rent, Netflix)"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
            <input
              type="text"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="Amount"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
            <input
              type="date"
              value={billDueDate}
              onChange={(e) => setBillDueDate(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
          </div>
        )

      case 'spending':
        return (
          <div className="space-y-4">
            <p className="text-[var(--color-text-secondary)]">
              Which category do you overspend in most?
            </p>
            {['Dining Out', 'Shopping', 'Entertainment', 'Subscriptions', 'Groceries', 'Transportation'].map(
              (category) => (
                <label
                  key={category}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                    overspendCategory === category
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="overspend"
                    checked={overspendCategory === category}
                    onChange={() => setOverspendCategory(category)}
                    className="h-4 w-4 border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                  />
                  <span className="text-[var(--color-text-primary)]">{category}</span>
                </label>
              )
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-2 text-sm font-medium text-[var(--color-accent)]">Step 4 of 5</p>
          <h1 className="mb-2 text-3xl font-bold text-[var(--color-text-primary)]">
            {goalDetails?.title ? `Let's set up your ${goalDetails.title.toLowerCase()}` : 'First Action'}
          </h1>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {renderGoalContent(state.selectedGoal)}
        </motion.div>

        {/* Actions */}
        <motion.div
          className="mt-8 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button variant="ghost" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            size="lg"
            onClick={handleContinue}
            className="group gap-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] px-8 text-white shadow-lg transition-all hover:shadow-xl hover:shadow-[var(--color-accent)]/25"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
