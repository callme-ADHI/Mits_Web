'use client'

import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cleanup: (() => void) | undefined
    ;(async () => {
      try {
        const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
          import('lenis'),
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ])
        gsap.registerPlugin(ScrollTrigger)
        const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
        cleanup = () => {
          gsap.ticker.remove(tick)
          lenis.destroy()
        }
      } catch (err) {
        console.warn('SmoothScroll failed to initialize:', err)
      }
    })()

    return () => cleanup?.()
  }, [])

  return null
}
