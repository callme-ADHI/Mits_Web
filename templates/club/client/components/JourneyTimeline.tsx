'use client'

import { useEffect, useRef } from 'react'

export interface TimelineEntry {
  id: string
  title: string
  date: Date | string
  type: 'achievement' | 'event'
  description?: string | null
}

export function JourneyTimeline({ entries }: { entries: TimelineEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (entries.length < 3) return
    if (typeof window === 'undefined') return

    let ctx: { revert: () => void } | undefined

    ;(async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ])
        gsap.registerPlugin(ScrollTrigger)

        const container = containerRef.current
        if (!container) return

        const mm = gsap.matchMedia()
        mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: 'top 20%',
              end: `+=${entries.length * 200}`,
              pin: true,
              scrub: 0.5,
            },
          })

          itemsRef.current.forEach((el, index) => {
            if (!el) return
            tl.fromTo(
              el,
              { opacity: 0.2, y: 20 },
              { opacity: 1, y: 0, duration: 1 },
              index * 0.8
            )
          })
        })
        ctx = mm
      } catch (err) {
        console.warn('JourneyTimeline GSAP error:', err)
      }
    })()

    return () => ctx?.revert()
  }, [entries.length])

  if (entries.length === 0) return null

  return (
    <div ref={containerRef} className="py-8">
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
          fontWeight: 700,
          color: 'var(--color-ink)',
          marginBottom: '2rem',
        }}
      >
        Our Journey & Milestones
      </h2>

      <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
        {entries.map((entry, idx) => (
          <div
            key={entry.id}
            ref={(el) => {
              itemsRef.current[idx] = el
            }}
            className="relative transition-opacity"
          >
            <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[var(--color-red)] border-2 border-white shadow-sm" />
            <time className="text-xs font-semibold uppercase tracking-wider text-[var(--color-red)] block mb-1">
              {new Date(entry.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
              })}
            </time>
            <h3 className="text-base font-bold text-[var(--color-ink)] mb-1">
              {entry.title}
            </h3>
            {entry.description && (
              <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {entry.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
