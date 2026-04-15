import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useTheme } from '@/context/ThemeContext'
import {
  Sun,
  Moon,
  Monitor,
  User,
  DollarSign,
  Bell,
  Shield,
  Palette,
  AlertTriangle,
  Smartphone,
  Download,
  Trash2,
  Check,
} from 'lucide-react'
import type { Theme } from '@/types'

type SettingsSection = 'profile' | 'financial' | 'notifications' | 'security' | 'appearance' | 'danger'

const sections: { id: SettingsSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'financial', label: 'Financial Identity', icon: DollarSign },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
]

const accentColors = [
  { id: 'blue', color: '#6366f1', label: 'Blue' },
  { id: 'purple', color: '#a855f7', label: 'Purple' },
  { id: 'green', color: '#10b981', label: 'Green' },
  { id: 'orange', color: '#f59e0b', label: 'Orange' },
  { id: 'rose', color: '#f43f5e', label: 'Rose' },
  { id: 'slate', color: '#64748b', label: 'Slate' },
]

export function Settings() {
  const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [accentColor, setAccentColor] = useState('blue')
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')

  // Profile state
  const [displayName, setDisplayName] = useState('User')
  const [email, setEmail] = useState('user@example.com')

  // Financial Identity state
  const [monthlyIncome, setMonthlyIncome] = useState('5000')
  const [currency, setCurrency] = useState('USD')
  const [financialPersona, setFinancialPersona] = useState('balanced')
  const [taxStatus, setTaxStatus] = useState('single')
  const [taxRate, setTaxRate] = useState('25')

  // Notifications state
  const [notifications, setNotifications] = useState({
    billDue: { email: true, push: true, inApp: true },
    budgetAlert: { email: false, push: true, inApp: true },
    largeTransaction: { email: true, push: true, inApp: true },
    aiInsight: { email: false, push: false, inApp: true },
    weeklySummary: { email: true, push: false, inApp: false },
    monthlyNetWorth: { email: true, push: false, inApp: true },
    savingsGoal: { email: true, push: true, inApp: true },
  })

  const themeOptions: { value: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  const personas = [
    { id: 'aggressive-saver', label: 'Aggressive Saver', icon: '🎯', desc: 'Maximize savings rate' },
    { id: 'debt-eliminator', label: 'Debt Eliminator', icon: '💳', desc: 'Focus on payoff schedule' },
    { id: 'wealth-builder', label: 'Wealth Builder', icon: '📈', desc: 'Investment-forward view' },
    { id: 'balanced', label: 'Balanced', icon: '⚖️', desc: 'Equal weight to all areas' },
    { id: 'starting-fresh', label: 'Starting Fresh', icon: '🆕', desc: 'Simplified view, educational' },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Email</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                  />
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-success)]/10 px-2 py-1 text-xs text-[var(--color-success)]">
                    <Check className="h-3 w-3" />
                    Verified
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Avatar</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-2xl font-bold text-white">
                    {displayName[0]?.toUpperCase() || 'U'}
                  </div>
                  <Button variant="outline" size="sm">
                    Upload Photo
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Language</label>
                  <select className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Timezone</label>
                  <select className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm">
                    <option>America/New_York (EST)</option>
                    <option>America/Los_Angeles (PST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Date Format</label>
                  <select className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        )

      case 'financial':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financial Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Monthly Income</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">$</span>
                    <input
                      type="text"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2 pl-8 pr-4 text-sm tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Primary Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm text-[var(--color-text-secondary)]">Financial Persona</label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {personas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => setFinancialPersona(persona.id)}
                      className={`rounded-lg border p-4 text-left transition-all ${
                        financialPersona === persona.id
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                          : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                      }`}
                    >
                      <span className="text-2xl">{persona.icon}</span>
                      <p className="mt-2 font-medium text-[var(--color-text-primary)]">{persona.label}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{persona.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Tax Filing Status</label>
                  <select
                    value={taxStatus}
                    onChange={(e) => setTaxStatus(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm"
                  >
                    <option value="single">Single</option>
                    <option value="married-joint">Married Filing Jointly</option>
                    <option value="married-separate">Married Filing Separately</option>
                    <option value="head-household">Head of Household</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Estimated Tax Rate</label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2 pl-4 pr-8 text-sm tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">%</span>
                  </div>
                </div>
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        )

      case 'notifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="py-3 text-left text-sm font-medium text-[var(--color-text-muted)]">Event</th>
                      <th className="py-3 text-center text-sm font-medium text-[var(--color-text-muted)]">Email</th>
                      <th className="py-3 text-center text-sm font-medium text-[var(--color-text-muted)]">Push</th>
                      <th className="py-3 text-center text-sm font-medium text-[var(--color-text-muted)]">In-App</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'billDue', label: 'Bill due in 3 days' },
                      { key: 'budgetAlert', label: 'Budget category over 80%' },
                      { key: 'largeTransaction', label: 'Large transaction detected' },
                      { key: 'aiInsight', label: 'New AI insight' },
                      { key: 'weeklySummary', label: 'Weekly financial summary' },
                      { key: 'monthlyNetWorth', label: 'Monthly net worth update' },
                      { key: 'savingsGoal', label: 'Savings goal reached' },
                    ].map(({ key, label }) => (
                      <tr key={key} className="border-b border-[var(--color-border)]">
                        <td className="py-3 text-sm text-[var(--color-text-primary)]">{label}</td>
                        {(['email', 'push', 'inApp'] as const).map((channel) => (
                          <td key={channel} className="py-3 text-center">
                            <input
                              type="checkbox"
                              checked={notifications[key as keyof typeof notifications][channel]}
                              onChange={(e) =>
                                setNotifications({
                                  ...notifications,
                                  [key]: {
                                    ...notifications[key as keyof typeof notifications],
                                    [channel]: e.target.checked,
                                  },
                                })
                              }
                              className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button className="mt-4">Save Preferences</Button>
            </CardContent>
          </Card>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Current Password</label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                  />
                </div>
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">New Password</label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                  />
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div key={level} className="h-1 flex-1 rounded-full bg-[var(--color-border)]" />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)]">Confirm New Password</label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                  />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">Authenticator App</p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Use an authenticator app for additional security
                    </p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { device: 'Chrome on Windows', location: 'New York, US', current: true },
                    { device: 'Safari on iPhone', location: 'New York, US', current: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-4">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-[var(--color-text-muted)]" />
                        <div>
                          <p className="font-medium text-[var(--color-text-primary)]">
                            {session.device}
                            {session.current && (
                              <span className="ml-2 text-xs text-[var(--color-success)]">Current</span>
                            )}
                          </p>
                          <p className="text-sm text-[var(--color-text-muted)]">{session.location}</p>
                        </div>
                      </div>
                      {!session.current && (
                        <Button variant="outline" size="sm">
                          Sign Out
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Export Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">Download Your Data</p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Export all your financial data as JSON
                    </p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Theme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        theme === option.value
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)]'
                      }`}
                    >
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Accent Color</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setAccentColor(color.id)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform ${
                        accentColor === color.id ? 'scale-110 ring-2 ring-offset-2' : ''
                      }`}
                      style={{
                        backgroundColor: color.color,
                        // @ts-expect-error CSS custom property for ring color
                        '--tw-ring-color': color.color,
                      }}
                      aria-label={color.label}
                    >
                      {accentColor === color.id && <Check className="h-5 w-5 text-white" />}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dashboard Density</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {[
                    { value: 'comfortable', label: 'Comfortable' },
                    { value: 'compact', label: 'Compact' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDensity(option.value as 'comfortable' | 'compact')}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        density === option.value
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'danger':
        return (
          <Card className="border-[var(--color-danger)]/30">
            <CardHeader>
              <CardTitle className="text-base text-[var(--color-danger)]">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">Archive Account</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Temporarily disable your account
                  </p>
                </div>
                <Button variant="outline">Archive</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">Delete All Data</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Permanently remove all your financial data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Navigation */}
        <nav className="shrink-0 lg:w-56">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)]'
                  } ${section.id === 'danger' ? 'text-[var(--color-danger)] hover:text-[var(--color-danger)]' : ''}`}
                >
                  <section.icon className="h-5 w-5 shrink-0" />
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          {renderSection()}
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[var(--color-danger)]">Delete All Data</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your financial data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Type <span className="font-mono font-semibold text-[var(--color-danger)]">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-danger)] focus:outline-none focus:ring-2 focus:ring-[var(--color-danger)]/20"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deleteConfirmText !== 'DELETE'}
                onClick={() => {
                  // Handle delete
                  setDeleteDialogOpen(false)
                  setDeleteConfirmText('')
                }}
              >
                Delete All Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
