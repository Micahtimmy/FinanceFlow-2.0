import { Outlet, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useOnboarding } from '@/context/OnboardingContext'

export function OnboardingLayout() {
  const { state } = useOnboarding()

  // If onboarding is complete, redirect to dashboard
  if (state.isComplete) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        <Outlet />
      </motion.div>
    </div>
  )
}
