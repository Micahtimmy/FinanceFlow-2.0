import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Wallet,
  CreditCard,
  TrendingUp,
  BarChart3,
  Calculator,
  Settings,
  LogOut,
  Moon,
  Sun,
  Briefcase,
  DollarSign,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { NotificationCenter } from '@/components/notifications'
import { toast } from 'sonner'

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Transactions', path: '/transactions', icon: Receipt },
  { label: 'Budget', path: '/budget', icon: Wallet },
  { label: 'Savings', path: '/savings', icon: PiggyBank },
  { label: 'Bills', path: '/bills', icon: CreditCard },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
]

const secondaryNavItems: NavItem[] = [
  { label: 'Net Worth', path: '/net-worth', icon: TrendingUp },
  { label: 'Debt Tracker', path: '/debt-tracker', icon: Calculator },
  { label: 'Investments', path: '/investments', icon: Briefcase },
  { label: 'Income', path: '/income-tracker', icon: DollarSign },
  { label: 'Retirement', path: '/retirement', icon: Clock },
]

function NavItemComponent({ item }: { item: NavItem }) {
  const location = useLocation()
  const isActive = location.pathname === item.path

  return (
    <NavLink to={item.path} className="block">
      <motion.div
        className={cn(
          'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'text-[var(--color-accent)]'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]'
        )}
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15 }}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[var(--color-accent)]"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        {isActive && (
          <motion.div
            layoutId="sidebar-active-bg"
            className="absolute inset-0 rounded-lg bg-[var(--color-accent)]/10"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <item.icon className="h-5 w-5 shrink-0 relative z-10" />
        <span className="relative z-10">{item.label}</span>
      </motion.div>
    </NavLink>
  )
}

export function Sidebar() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/auth/login')
  }

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User'
  const email = user?.email || 'user@example.com'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <aside className="hidden md:flex h-screen w-[var(--sidebar-width)] flex-col border-r border-[var(--color-border)] bg-[var(--color-card)]">
      {/* Logo and Notifications */}
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)]">
            <span className="text-sm font-bold text-white">F</span>
          </div>
          <span className="text-lg font-semibold gradient-text">FinanceFlow</span>
        </div>
        <NotificationCenter />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItemComponent key={item.path} item={item} />
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          {secondaryNavItems.map((item) => (
            <NavItemComponent key={item.path} item={item} />
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[var(--color-border)] p-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)]"
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span>{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <Separator className="my-2" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-background-secondary)]">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url || ''} alt={displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                  {displayName}
                </p>
                <p className="truncate text-xs text-[var(--color-text-muted)]">
                  {email}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <NavLink to="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-[var(--color-danger)]">
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
