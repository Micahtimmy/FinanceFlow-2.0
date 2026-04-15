import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <motion.div
        className="max-w-lg text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <motion.div
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent-3)]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-3xl font-bold text-white">F</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="gradient-text">Your money.</span>
          <br />
          <span className="gradient-text">Finally makes sense.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mb-8 text-lg text-[var(--color-text-secondary)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Tell us one thing and we'll build your financial home around it.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            size="lg"
            onClick={() => navigate('/onboarding/goal')}
            className="group gap-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] px-8 text-white shadow-lg hover:shadow-xl hover:shadow-[var(--color-accent)]/25 transition-all"
          >
            Let's start
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-gradient-to-br from-[var(--color-accent)]/10 via-[var(--color-accent-2)]/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-tr from-[var(--color-accent-3)]/10 via-[var(--color-accent-2)]/5 to-transparent blur-3xl" />
      </div>
    </div>
  )
}
