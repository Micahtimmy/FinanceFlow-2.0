import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

export function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Password strength calculation
  const getPasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    let score = 0
    if (pass.length >= 8) score++
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) score++
    if (pass.match(/\d/)) score++
    if (pass.match(/[^a-zA-Z\d]/)) score++

    if (score <= 1) return { score, label: 'Weak', color: 'var(--color-danger)' }
    if (score === 2) return { score, label: 'Fair', color: 'var(--color-warning)' }
    if (score === 3) return { score, label: 'Good', color: 'var(--color-accent)' }
    return { score, label: 'Strong', color: 'var(--color-success)' }
  }

  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate signup (replace with real auth)
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to onboarding for new users
      navigate('/onboarding')
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
            <h1 className="mb-2 text-2xl font-bold text-[var(--color-text-primary)]">
              Create an account
            </h1>
            <p className="mb-6 text-[var(--color-text-secondary)]">
              Start your journey to financial freedom
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm text-[var(--color-text-secondary)]"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2.5 pl-10 pr-4 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                  />
                </div>
              </div>

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

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm text-[var(--color-text-secondary)]"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2.5 pl-10 pr-10 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className="h-1 flex-1 rounded-full"
                          style={{
                            backgroundColor:
                              level <= passwordStrength.score
                                ? passwordStrength.color
                                : 'var(--color-border)',
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </p>
                  </div>
                )}
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
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[var(--color-border)]" />
              <span className="text-sm text-[var(--color-text-muted)]">or</span>
              <div className="h-px flex-1 bg-[var(--color-border)]" />
            </div>

            {/* Google OAuth (UI only) */}
            <Button variant="outline" className="w-full gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Terms */}
            <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-[var(--color-accent)] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[var(--color-accent)] hover:underline">
                Privacy Policy
              </a>
            </p>

            {/* Sign In Link */}
            <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-[var(--color-accent)] hover:underline">
                Sign in
              </Link>
            </p>
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
