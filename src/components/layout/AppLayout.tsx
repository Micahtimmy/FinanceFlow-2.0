import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { pageTransition } from '@/lib/animations'

export function AppLayout() {
  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <motion.div
          className="min-h-full"
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          transition={pageTransition.transition}
        >
          <Outlet />
        </motion.div>
      </main>

      <MobileNav />
    </div>
  )
}
