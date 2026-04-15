import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  ArrowRight,
  Target,
  Calendar,
  DollarSign,
  Sparkles,
  Check,
} from 'lucide-react'
import { useUser } from '@/context/UserContext'
import type { SavingsGoal } from '@/types'

type WizardStep = 'name' | 'amount' | 'date' | 'review'

const goalIcons = [
  { icon: '🏖️', label: 'Vacation' },
  { icon: '🚗', label: 'Car' },
  { icon: '🏠', label: 'Home' },
  { icon: '🎓', label: 'Education' },
  { icon: '💍', label: 'Wedding' },
  { icon: '🛡️', label: 'Emergency' },
  { icon: '📱', label: 'Tech' },
  { icon: '🎁', label: 'Gift' },
]

export function SavingsNew() {
  const navigate = useNavigate()
  const { addSavingsGoal } = useUser()

  const [step, setStep] = useState<WizardStep>('name')
  const [goalName, setGoalName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('🎯')
  const [targetAmount, setTargetAmount] = useState('')
  const [hasDeadline, setHasDeadline] = useState(false)
  const [targetDate, setTargetDate] = useState('')

  const steps: WizardStep[] = ['name', 'amount', 'date', 'review']
  const currentStepIndex = steps.indexOf(step)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const canProceed = () => {
    switch (step) {
      case 'name':
        return goalName.trim().length > 0
      case 'amount':
        return parseFloat(targetAmount) > 0
      case 'date':
        return true // Date is optional
      case 'review':
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex])
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setStep(steps[prevIndex])
    }
  }

  const handleCreate = () => {
    const newGoal: SavingsGoal = {
      id: crypto.randomUUID(),
      name: goalName.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      targetDate: hasDeadline && targetDate ? new Date(targetDate) : undefined,
      createdAt: new Date(),
    }

    addSavingsGoal(newGoal)
    navigate('/savings')
  }

  const renderStep = () => {
    switch (step) {
      case 'name':
        return (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10">
                <Target className="h-8 w-8 text-[var(--color-accent)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                What are you saving for?
              </h2>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                Give your goal a name that motivates you
              </p>
            </div>

            <div>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g., Dream Vacation, New Car, Emergency Fund"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-4 text-center text-lg focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                autoFocus
              />
            </div>

            <div>
              <p className="mb-3 text-center text-sm text-[var(--color-text-muted)]">
                Choose an icon
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {goalIcons.map(({ icon, label }) => (
                  <button
                    key={icon}
                    onClick={() => setSelectedIcon(icon)}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all ${
                      selectedIcon === icon
                        ? 'bg-[var(--color-accent)] ring-2 ring-[var(--color-accent)] ring-offset-2'
                        : 'bg-[var(--color-background-secondary)] hover:bg-[var(--color-border)]'
                    }`}
                    title={label}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'amount':
        return (
          <motion.div
            key="amount"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-success)]/10">
                <DollarSign className="h-8 w-8 text-[var(--color-success)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                How much do you need?
              </h2>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                Set your target amount for "{goalName}"
              </p>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-[var(--color-text-muted)]">
                $
              </span>
              <input
                type="text"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="10,000"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] py-4 pl-12 pr-4 text-center text-3xl font-bold tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                autoFocus
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {[1000, 5000, 10000, 25000, 50000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTargetAmount(amount.toString())}
                  className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-accent)]"
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>
          </motion.div>
        )

      case 'date':
        return (
          <motion.div
            key="date"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent-2)]/10">
                <Calendar className="h-8 w-8 text-[var(--color-accent-2)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                When do you want to reach this goal?
              </h2>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                Setting a deadline helps you stay on track
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] p-4 transition-all hover:border-[var(--color-accent)]/50">
                <input
                  type="radio"
                  name="deadline"
                  checked={!hasDeadline}
                  onChange={() => setHasDeadline(false)}
                  className="h-4 w-4 text-[var(--color-accent)]"
                />
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">No specific date</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    I'll save at my own pace
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] p-4 transition-all hover:border-[var(--color-accent)]/50">
                <input
                  type="radio"
                  name="deadline"
                  checked={hasDeadline}
                  onChange={() => setHasDeadline(true)}
                  className="h-4 w-4 text-[var(--color-accent)]"
                />
                <div className="flex-1">
                  <p className="font-medium text-[var(--color-text-primary)]">Set a target date</p>
                  {hasDeadline && (
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
                    />
                  )}
                </div>
              </label>
            </div>

            {hasDeadline && targetDate && parseFloat(targetAmount) > 0 && (
              <div className="rounded-xl bg-[var(--color-accent)]/5 p-4 text-center">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  To reach your goal, you'll need to save approximately
                </p>
                <p className="mt-1 text-2xl font-bold text-[var(--color-accent)]">
                  {formatCurrency(
                    parseFloat(targetAmount) /
                      Math.max(
                        1,
                        Math.ceil(
                          (new Date(targetDate).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24 * 30)
                        )
                      )
                  )}
                  /month
                </p>
              </div>
            )}
          </motion.div>
        )

      case 'review':
        return (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)]">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Ready to start saving?
              </h2>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                Review your goal before creating it
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-background-secondary)] text-3xl">
                    {selectedIcon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                      {goalName}
                    </h3>
                    <p className="text-3xl font-bold gradient-text">
                      {formatCurrency(parseFloat(targetAmount) || 0)}
                    </p>
                  </div>
                </div>

                {hasDeadline && targetDate && (
                  <div className="mt-4 flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Target date:{' '}
                      {new Date(targetDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/savings"
          className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Savings
        </Link>
        <h1 className="text-3xl font-bold gradient-text">Create Savings Goal</h1>
      </div>

      {/* Progress */}
      <div className="mx-auto mb-8 max-w-md">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  index < currentStepIndex
                    ? 'bg-[var(--color-success)] text-white'
                    : index === currentStepIndex
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-background-secondary)] text-[var(--color-text-muted)]'
                }`}
              >
                {index < currentStepIndex ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-12 sm:w-16 ${
                    index < currentStepIndex
                      ? 'bg-[var(--color-success)]'
                      : 'bg-[var(--color-border)]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mx-auto max-w-md">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step === 'review' ? (
            <Button
              onClick={handleCreate}
              className="gap-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
            >
              Create Goal
              <Sparkles className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
