import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-[var(--color-background)]">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent-3)]">
              <span className="text-lg font-bold text-white">F</span>
            </div>
            <span className="text-xl font-semibold gradient-text">FinanceFlow</span>
          </Link>
        </div>

        <Card>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Back Link */}
                  <Link
                    to="/auth/login"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                  </Link>

                  <h1 className="mb-2 text-2xl font-bold text-[var(--color-text-primary)]">
                    Reset your password
                  </h1>
                  <p className="mb-6 text-[var(--color-text-secondary)]">
                    Enter your email and we'll send you a link to reset your password.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1 block text-sm text-[var(--color-text-secondary)]"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2.5 pl-10 pr-4 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                        />
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <p className="text-sm text-[var(--color-danger)]">{error}</p>
                    )}

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send reset link'}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]"
                  >
                    <CheckCircle className="h-8 w-8 text-white" />
                  </motion.div>
                  <h2 className="mb-2 text-xl font-bold text-[var(--color-text-primary)]">
                    Check your email
                  </h2>
                  <p className="mb-6 text-[var(--color-text-secondary)]">
                    We've sent a password reset link to{' '}
                    <span className="font-medium text-[var(--color-text-primary)]">{email}</span>
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Didn't receive the email?{' '}
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-[var(--color-accent)] hover:underline"
                    >
                      Click to resend
                    </button>
                  </p>
                  <Link to="/auth/login">
                    <Button variant="outline" className="mt-6">
                      Back to sign in
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-gradient-to-br from-[var(--color-accent)]/10 via-[var(--color-accent-2)]/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-tr from-[var(--color-accent-3)]/10 via-[var(--color-accent-2)]/5 to-transparent blur-3xl" />
      </div>
    </div>
  )
}
