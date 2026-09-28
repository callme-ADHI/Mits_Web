'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer({
  orgName = 'Club Website',
  contactEmail = null,
}: {
  orgName?: string
  contactEmail?: string | null
}) {
  const footerRef = useRef<HTMLElement>(null)
  const [useReveal, setUseReveal] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isDesktop = window.innerWidth >= 1024

    const updateHeight = () => {
      if (!footerRef.current) return
      const h = footerRef.current.offsetHeight
      // If footer is taller than 70% viewport, disable reveal
      const tooTall = h > window.innerHeight * 0.7
      setUseReveal(isDesktop && !prefersReducedMotion && !tooTall)
      if (isDesktop && !prefersReducedMotion && !tooTall) {
        document.documentElement.style.setProperty('--footer-h', `${h}px`)
      } else {
        document.documentElement.style.setProperty('--footer-h', '0px')
      }
    }

    updateHeight()
    const ro = new ResizeObserver(updateHeight)
    if (footerRef.current) ro.observe(footerRef.current)

    return () => ro.disconnect()
  }, [])

  return (
    <footer
      ref={footerRef}
      style={{
        background: 'var(--color-ink)',
        color: 'var(--color-paper)',
        padding: '4rem 2rem 2.5rem',
        ...(useReveal
          ? {
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1,
            }
          : {
              position: 'relative',
              zIndex: 10,
            }),
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Brand column */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.15rem',
                marginBottom: '0.75rem',
                color: 'var(--color-paper)',
                maxWidth: 'none',
              }}
            >
              <span style={{ color: 'var(--color-red)' }}>■</span> {orgName.toUpperCase()}
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.6,
                maxWidth: '26ch',
              }}
            >
              {orgName}
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '1rem',
                maxWidth: 'none',
              }}
            >
              NAVIGATE
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      transition: 'color 150ms',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--color-paper)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          {contactEmail && (
            <div>
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '1rem',
                  maxWidth: 'none',
                }}
              >
                CONTACT
              </p>
              <a
                href={`mailto:${contactEmail}`}
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                }}
              >
                {contactEmail}
              </a>
            </div>
          )}
        </div>

        <p
          style={{
            paddingTop: '2rem',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.3)',
            maxWidth: 'none',
          }}
        >
          © {new Date().getFullYear()} {orgName}. Built with MITS Web.
        </p>
      </div>
    </footer>
  )
}
