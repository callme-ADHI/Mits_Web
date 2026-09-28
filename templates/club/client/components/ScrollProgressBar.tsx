'use client'

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const shouldReduceMotion = useReducedMotion()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: 'var(--color-red)',
        transformOrigin: '0%',
        scaleX: shouldReduceMotion ? scrollYProgress : scaleX,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  )
}
