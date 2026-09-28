'use client'

import { useEffect, useRef } from 'react'
import AchievementCard from '@/components/AchievementCard'

export interface AchievementItem {
  id: string
  title: string
  description?: string | null
  achievementDate: Date | string
  imageUrl?: string | null
}

export function AchievementsGallery({ achievements }: { achievements: AchievementItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (achievements.length < 3) return
    if (typeof window === 'undefined') return

    let ctx: { revert: () => void } | undefined

    ;(async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ])
        gsap.registerPlugin(ScrollTrigger)

        const section = sectionRef.current
        const track = trackRef.current
        if (!section || !track) return

        const mm = gsap.matchMedia()
        mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
          const distance = () => track.scrollWidth - window.innerWidth + 80
          if (distance() > 0) {
            gsap.to(track, {
              x: () => -distance(),
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${distance()}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
              },
            })
          }
        })
        ctx = mm
      } catch (e) {
        console.warn('GSAP ScrollTrigger failed:', e)
      }
    })()

    return () => ctx?.revert()
  }, [achievements.length])

  if (achievements.length === 0) {
    return (
      <p style={{ fontSize: '1.1rem', color: 'var(--color-ink)', opacity: 0.5 }}>
        No achievements yet — stay tuned.
      </p>
    )
  }

  // Under 3 achievements: standard vertical/grid layout
  if (achievements.length < 3) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {achievements.map((a) => (
          <AchievementCard key={a.id} achievement={a} />
        ))}
      </div>
    )
  }

  // 3+ achievements: horizontal pin track on desktop (>=1024px), standard grid on mobile / reduced motion
  return (
    <div ref={sectionRef} className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex flex-col lg:flex-row gap-6 w-full lg:w-max lg:py-6"
      >
        {achievements.map((a) => (
          <div key={a.id} className="w-full lg:w-[380px] shrink-0">
            <AchievementCard achievement={a} />
          </div>
        ))}
      </div>
    </div>
  )
}
