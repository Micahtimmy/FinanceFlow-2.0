import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'
import { useOnboarding, goalOptions, type GoalId } from '@/context/OnboardingContext'

export function GoalSelection() {
  const navigate = useNavigate()
  const { state, setGoal, setStep } = useOnboarding()
  const [selectedGoal, setSelectedGoal] = useState<GoalId | null>(state.selectedGoal)

  const handleGoalSelect = (goalId: GoalId) => {
    setSelectedGoal(goalId)
  }

  const handleContinue = () => {
    if (selectedGoal) {
      setGoal(selectedGoal)
      setStep(2)
      navigate('/onboarding/profile')
    }
  }

  const selectedGoalDetails = goalOptions.find((g) => g.id === selectedGoal)

  return (
    <div className="min-h-screen p-6 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-2 text-sm font-medium text-[var(--color-accent)]">Step 1 of 5</p>
          <h1 className="mb-4 text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
            What's your primary financial goal right now?
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Choose the one that matters most. You can always change it later.
          </p>
        </motion.div>

        {/* Goal Cards Grid */}
        <motion.div
          className="mb-8 grid gap-4 sm:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {goalOptions.map((goal, index) => {
            const isSelected = selectedGoal === goal.id

            return (
              <motion.button
                key={goal.id}
                onClick={() => handleGoalSelect(goal.id)}
                className={`relative rounded-xl border p-5 text-left transition-all ${
                  isSelected
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/25'
                    : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-accent)]/50 hover:shadow-md'
                }`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{goal.icon}</span>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold ${
                        isSelected ? 'text-white' : 'text-[var(--color-text-primary)]'
                      }`}
                    >
                      {goal.title}
                    </h3>
                    <p
                      className={`mt-1 text-sm ${
                        isSelected ? 'text-white/80' : 'text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {goal.description}
                    </p>
                  </div>

                  {/* Checkmark */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white"
                      >
                        <Check className="h-4 w-4 text-[var(--color-accent)]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Selection Message */}
        <AnimatePresence>
          {selectedGoalDetails && (
            <motion.p
              className="mb-8 text-center text-[var(--color-text-secondary)]"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              Great. We'll set up your <span className="font-medium text-[var(--color-accent)]">{selectedGoalDetails.title}</span> dashboard now.
            </motion.p>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedGoal}
            className="group gap-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] px-8 text-white shadow-lg transition-all hover:shadow-xl hover:shadow-[var(--color-accent)]/25 disabled:opacity-50 disabled:shadow-none"
          >
            {selectedGoalDetails ? `Build my ${selectedGoalDetails.title}` : 'Select a goal to continue'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
