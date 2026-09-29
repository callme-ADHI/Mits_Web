'use client'

import { useRef, useState, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

interface StatCounterProps {
  value: number
  label: string
  subtext?: string
  suffix?: string
  icon?: React.ReactNode
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// Module-level set to track which counters have animated during this session
const hasAnimatedSet = new Set<string>()

export function StatCounter({ value, label, subtext, suffix = '', icon }: StatCounterProps) {
  const counterKey = `${label}-${value}`
  const shouldReduceMotion = useReducedMotion()

  const [count, setCount] = useState(() => {
    if (typeof window === 'undefined') return value
    if (hasAnimatedSet.has(counterKey)) return value
    return 0
  })

  const [started, setStarted] = useState(() => {
    if (typeof window === 'undefined') return true
    return hasAnimatedSet.has(counterKey)
  })

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasAnimatedSet.has(counterKey) || shouldReduceMotion) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
        }
      },
      { threshold: 0.2 }
    )

    const el = ref.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [counterKey, shouldReduceMotion])

  useEffect(() => {
    if (shouldReduceMotion) return
    if (!started || hasAnimatedSet.has(counterKey)) return

    const duration = 1000
    const startTime = performance.now()
    let frameId: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const current = Math.round(easeOut(progress) * value)
      setCount(current)

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      } else {
        hasAnimatedSet.add(counterKey)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [counterKey, started, value, shouldReduceMotion])

  const displayCount = shouldReduceMotion || hasAnimatedSet.has(counterKey) ? value : count

  return (
    <div
      ref={ref}
      className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--ink)] flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className="text-3xl font-semibold text-[var(--ink)] tabular-nums tracking-tight leading-none mb-1.5">
          {displayCount}
          {suffix}
        </div>
        {subtext && (
          <div className="text-xs text-[var(--muted)] font-medium truncate">
            {subtext}
          </div>
        )}
      </div>
    </div>
  )
}
