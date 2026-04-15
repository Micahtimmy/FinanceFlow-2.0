import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Wallet,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

const mobileNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Transactions', path: '/transactions', icon: Receipt },
  { label: 'Budget', path: '/budget', icon: Wallet },
  { label: 'Savings', path: '/savings', icon: PiggyBank },
  { label: 'More', path: '/more', icon: MoreHorizontal },
]

export function MobileNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-card)]/95 backdrop-blur-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {mobileNavItems.map((item) => {
          const isActive = item.path === '/more'
            ? ['/settings', '/net-worth', '/debt-tracker', '/bills', '/analytics', '/investments', '/income-tracker', '/retirement'].some(p => location.pathname.startsWith(p))
            : location.pathname === item.path

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center min-w-[64px] py-1"
            >
              <motion.div
                className={cn(
                  'relative flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors',
                  isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
                )}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute inset-0 rounded-lg bg-[var(--color-accent)]/10"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className="h-5 w-5 relative z-10" />
                <span className="text-[10px] font-medium relative z-10">{item.label}</span>
              </motion.div>
            </NavLink>
          )
        })}
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
