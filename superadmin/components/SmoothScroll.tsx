'use client'

import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cleanup: (() => void) | undefined
    ;(async () => {
      try {
        const { default: Lenis } = await import('lenis')
        const lenis = new Lenis({
          duration: 1.0,
          smoothWheel: true,
        })

        let rafId: number
        function raf(time: number) {
          lenis.raf(time)
          rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)

        cleanup = () => {
          cancelAnimationFrame(rafId)
          lenis.destroy()
        }
      } catch (err) {
        console.warn('Lenis SmoothScroll failed to initialize:', err)
      }
    })()

    return () => cleanup?.()
  }, [])

  return null
}
