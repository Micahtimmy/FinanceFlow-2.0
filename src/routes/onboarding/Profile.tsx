import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
]

export function Profile() {
  const navigate = useNavigate()
  const { state, setProfile, setStep } = useOnboarding()

  const [displayName, setDisplayName] = useState(state.displayName || '')
  const [monthlyIncome, setMonthlyIncome] = useState(
    state.monthlyIncome ? state.monthlyIncome.toString() : ''
  )
  const [currency, setCurrency] = useState(state.primaryCurrency || 'USD')

  const [errors, setErrors] = useState<{ displayName?: string; monthlyIncome?: string }>({})

  const validateForm = () => {
    const newErrors: { displayName?: string; monthlyIncome?: string } = {}

    if (!displayName.trim()) {
      newErrors.displayName = 'Please enter your name'
    }

    const incomeNum = parseFloat(monthlyIncome.replace(/,/g, ''))
    if (!monthlyIncome || isNaN(incomeNum) || incomeNum <= 0) {
      newErrors.monthlyIncome = 'Please enter a valid income'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateForm()) {
      setProfile({
        displayName: displayName.trim(),
        monthlyIncome: parseFloat(monthlyIncome.replace(/,/g, '')),
        primaryCurrency: currency,
      })
      setStep(3)
      navigate('/onboarding/first-action')
    }
  }

  const handleBack = () => {
    navigate('/onboarding/goal')
  }

  const formatIncome = (value: string) => {
    // Remove non-numeric characters except decimal
    const numeric = value.replace(/[^0-9.]/g, '')
    return numeric
  }

  const selectedCurrency = currencies.find((c) => c.code === currency)

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-2 text-sm font-medium text-[var(--color-accent)]">Step 3 of 5</p>
          <h1 className="mb-2 text-3xl font-bold text-[var(--color-text-primary)]">
            Tell us about yourself
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            We'll use this to personalize your experience
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Display Name */}
          <div className="relative">
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value)
                if (errors.displayName) setErrors({ ...errors, displayName: undefined })
              }}
              className={`peer w-full rounded-xl border bg-[var(--color-card)] px-4 pb-3 pt-6 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 ${
                errors.displayName
                  ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]'
                  : 'border-[var(--color-border)] focus:border-[var(--color-accent)]'
              }`}
              placeholder=" "
            />
            <label
              htmlFor="displayName"
              className="pointer-events-none absolute left-4 top-4 origin-left text-[var(--color-text-muted)] transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-75"
            >
              What should we call you?
            </label>
            {errors.displayName && (
              <p className="mt-1.5 text-sm text-[var(--color-danger)]">{errors.displayName}</p>
            )}
          </div>

          {/* Monthly Income */}
          <div className="relative">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                {selectedCurrency?.symbol}
              </span>
              <input
                type="text"
                id="monthlyIncome"
                value={monthlyIncome}
                onChange={(e) => {
                  setMonthlyIncome(formatIncome(e.target.value))
                  if (errors.monthlyIncome) setErrors({ ...errors, monthlyIncome: undefined })
                }}
                className={`peer w-full rounded-xl border bg-[var(--color-card)] pb-3 pl-8 pr-4 pt-6 text-base tabular-nums transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 ${
                  errors.monthlyIncome
                    ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]'
                    : 'border-[var(--color-border)] focus:border-[var(--color-accent)]'
                }`}
                placeholder=" "
              />
              <label
                htmlFor="monthlyIncome"
                className="pointer-events-none absolute left-8 top-4 origin-left text-[var(--color-text-muted)] transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-75"
              >
                Monthly income after tax
              </label>
            </div>
            {errors.monthlyIncome && (
              <p className="mt-1.5 text-sm text-[var(--color-danger)]">{errors.monthlyIncome}</p>
            )}
          </div>

          {/* Currency */}
          <div className="relative">
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 pb-3 pt-6 text-base transition-colors focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
            <label
              htmlFor="currency"
              className="pointer-events-none absolute left-4 top-2 text-xs text-[var(--color-text-muted)]"
            >
              Primary currency
            </label>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <svg
                className="h-5 w-5 text-[var(--color-text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
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
