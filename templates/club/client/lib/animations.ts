import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const heroLogo: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const imageReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 } },
}

export const ruleDraw: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
}
