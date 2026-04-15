import type { Variants, Transition } from 'framer-motion'

export const pageTransition: {
  initial: { opacity: number; y: number }
  animate: { opacity: number; y: number }
  exit: { opacity: number; y: number }
  transition: Transition
} = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
}

export const cardHover = {
  whileHover: { y: -2, transition: { duration: 0.15 } },
  whileTap: { scale: 0.98 },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const slideUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}
