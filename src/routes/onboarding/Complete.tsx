import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Check, Target, Wallet, TrendingUp } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'

interface ConfettiParticle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  rotation: number
  rotationSpeed: number
  size: number
}

export function Complete() {
  const navigate = useNavigate()
  const { state, completeOnboarding, getSelectedGoalDetails } = useOnboarding()
  const goalDetails = getSelectedGoalDetails()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  const formatCurrency = useCallback(
    (value: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: state.primaryCurrency,
        minimumFractionDigits: 0,
      }).format(value)
    },
    [state.primaryCurrency]
  )

  // Confetti animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b']
    const particles: ConfettiParticle[] = []

    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20 - 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        size: Math.random() * 8 + 4,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let activeParticles = 0

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.3 // gravity
        p.vx *= 0.99 // air resistance
        p.rotation += p.rotationSpeed

        if (p.y < canvas.height + 50) {
          activeParticles++

          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.fillStyle = p.color
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
          ctx.restore()
        }
      })

      if (activeParticles > 0) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const handleComplete = () => {
    completeOnboarding()
    // Navigate to the goal-appropriate route
    if (goalDetails?.routesTo) {
      navigate(goalDetails.routesTo)
    } else {
      navigate('/dashboard')
    }
  }

  const getSummaryItems = () => {
    const items: { icon: React.ReactNode; label: string; value: string }[] = []

    if (goalDetails) {
      items.push({
        icon: <Target className="h-5 w-5 text-[var(--color-accent)]" />,
        label: 'Primary Goal',
        value: goalDetails.title,
      })
    }

    if (state.monthlyIncome) {
      items.push({
        icon: <Wallet className="h-5 w-5 text-[var(--color-success)]" />,
        label: 'Monthly Income',
        value: formatCurrency(state.monthlyIncome),
      })
    }

    // Add first action summary based on goal
    const actionData = state.firstActionData
    if (state.selectedGoal === 'emergency-fund' && actionData.emergencyFundTarget) {
      items.push({
        icon: <TrendingUp className="h-5 w-5 text-[var(--color-accent-2)]" />,
        label: 'Emergency Fund Target',
        value: formatCurrency(actionData.emergencyFundTarget as number),
      })
    }

    return items
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-6">
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-10"
        aria-hidden="true"
      />

      <div className="relative z-20 w-full max-w-lg text-center">
        {/* Success Icon */}
        <motion.div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-success)] to-[var(--color-accent)]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 15,
            delay: 0.2,
          }}
        >
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="mb-2 text-3xl font-bold gradient-text">
            You're all set, {state.displayName || 'friend'}!
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Here's what we've set up for you
          </p>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                {getSummaryItems().map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg bg-[var(--color-background-secondary)] p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-card)]">
                      {item.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm text-[var(--color-text-muted)]">{item.label}</p>
                      <p className="font-semibold text-[var(--color-text-primary)]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-left"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
            Next recommended step:
          </p>
          <p className="text-[var(--color-text-primary)]">
            {state.selectedGoal === 'budget' && 'Review your budget categories and add more details'}
            {state.selectedGoal === 'save' && 'Set up automatic transfers to your savings goal'}
            {state.selectedGoal === 'debt' && 'Add all your debts to see your complete payoff plan'}
            {state.selectedGoal === 'invest' && 'Connect your investment accounts to track performance'}
            {state.selectedGoal === 'net-worth' && 'Add all your assets and liabilities for a complete picture'}
            {state.selectedGoal === 'emergency-fund' && 'Set up automatic savings transfers'}
            {state.selectedGoal === 'income' && 'Add your income sources to track progress'}
            {state.selectedGoal === 'retire' && 'Add your retirement accounts to track progress'}
            {state.selectedGoal === 'bills' && 'Add all your recurring bills to never miss a payment'}
            {state.selectedGoal === 'spending' && 'Connect accounts to automatically track spending'}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="lg"
            onClick={handleComplete}
            className="mt-8 group gap-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] px-8 text-white shadow-lg transition-all hover:shadow-xl hover:shadow-[var(--color-accent)]/25"
          >
            Go to my dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
