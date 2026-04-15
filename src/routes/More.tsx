import { NavLink } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import {
  TrendingUp,
  Calculator,
  CreditCard,
  BarChart3,
  Settings,
  Moon,
  Sun,
  LogOut,
  Briefcase,
  DollarSign,
  Clock,
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const menuItems = [
  { label: 'Net Worth', path: '/net-worth', icon: TrendingUp },
  { label: 'Debt Tracker', path: '/debt-tracker', icon: Calculator },
  { label: 'Bills', path: '/bills', icon: CreditCard },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Investments', path: '/investments', icon: Briefcase },
  { label: 'Income Tracker', path: '/income-tracker', icon: DollarSign },
  { label: 'Retirement', path: '/retirement', icon: Clock },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export function More() {
  const { resolvedTheme, setTheme, theme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark')
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">More</h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Additional features and settings
        </p>
      </div>

      <div className="max-w-md space-y-2">
        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path}>
            <Card className="transition-all hover:border-[var(--color-accent)]">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-background-secondary)]">
                  <item.icon className="h-5 w-5 text-[var(--color-accent)]" />
                </div>
                <span className="font-medium text-[var(--color-text-primary)]">{item.label}</span>
              </CardContent>
            </Card>
          </NavLink>
        ))}

        <button onClick={toggleTheme} className="w-full">
          <Card className="transition-all hover:border-[var(--color-accent)]">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-background-secondary)]">
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-5 w-5 text-[var(--color-accent)]" />
                ) : (
                  <Moon className="h-5 w-5 text-[var(--color-accent)]" />
                )}
              </div>
              <span className="font-medium text-[var(--color-text-primary)]">
                {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </CardContent>
          </Card>
        </button>

        <Card className="transition-all hover:border-[var(--color-danger)]">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-danger)]/10">
              <LogOut className="h-5 w-5 text-[var(--color-danger)]" />
            </div>
            <span className="font-medium text-[var(--color-danger)]">Sign Out</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
