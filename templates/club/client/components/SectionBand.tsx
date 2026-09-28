'use client'

import { useRef, type ReactNode, useEffect } from 'react'

interface SectionBandProps {
  tone?: 'paper' | 'tint'
  children: ReactNode
  id?: string
  parallax?: boolean
  style?: React.CSSProperties
}

export default function SectionBand({
  tone = 'paper',
  children,
  id,
  parallax = false,
  style,
}: SectionBandProps) {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!parallax || reducedMotion || !bgRef.current) return

    let cleanup: (() => void) | undefined
    ;(async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (!bgRef.current) return

      const ctx = gsap.context(() => {
        gsap.to(bgRef.current, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: bgRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }, bgRef)
      cleanup = () => ctx.revert()
    })()

    return () => cleanup?.()
  }, [parallax])

  return (
    <section
      id={id}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: tone === 'tint' ? 'var(--color-tint)' : 'var(--color-paper)',
        ...style,
      }}
    >
      {/* Parallax bg layer — only rendered when parallax is true */}
      {parallax && (
        <div
          ref={bgRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-10% 0',
            background: tone === 'tint' ? 'var(--color-tint)' : 'var(--color-paper)',
            zIndex: 0,
          }}
        />
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 2rem',
        }}
      >
        {children}
      </div>
    </section>
  )
}
