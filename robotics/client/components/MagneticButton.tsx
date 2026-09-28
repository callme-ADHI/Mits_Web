'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useSpring } from 'framer-motion'

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function MagneticButton({ children, className, style, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [canHover, setCanHover] = useState(false)

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setCanHover(hasHover && !prefersReducedMotion)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!canHover || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    // Drift up to ~20% toward cursor
    const distanceX = (e.clientX - centerX) * 0.2
    const distanceY = (e.clientY - centerY) * 0.2
    x.set(distanceX)
    y.set(distanceY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x, y, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}
