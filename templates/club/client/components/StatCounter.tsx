'use client'

import { useRef, useState, useEffect } from 'react'

interface StatCounterProps {
  value: number
  label: string
  suffix?: string
  isFirst?: boolean
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export default function StatCounter({ value, label, suffix = '', isFirst = false }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setCount(value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started, value])

  useEffect(() => {
    if (!started) return
    const duration = 1400
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.round(easeOut(progress) * value))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, value])

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '0 3rem',
        borderLeft: isFirst ? 'none' : '1px solid var(--color-hairline)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 700,
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          color: 'var(--color-red)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count}
        {suffix}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--color-slate)',
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </span>
    </div>
  )
}
