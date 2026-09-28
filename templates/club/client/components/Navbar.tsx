'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'HOME' },
  { href: '/events', label: 'EVENTS' },
  { href: '/achievements', label: 'ACHIEVEMENTS' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
]

export default function Navbar({ orgName = 'ROBOTICS CLUB' }: { orgName?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--color-paper)',
        borderBottom: scrolled ? '1px solid var(--color-hairline)' : '1px solid transparent',
        transition: 'border-color 300ms ease',
      }}
    >
      <nav
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 2rem',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'var(--color-ink)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          <span style={{ color: 'var(--color-red)' }}>■</span> {orgName.toUpperCase()}
        </Link>

        {/* Desktop links */}
        <ul
          style={{
            display: 'flex',
            gap: '2rem',
            listStyle: 'none',
            alignItems: 'center',
          }}
          className="nav-desktop"
        >
          {links.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: isActive ? 'var(--color-red)' : 'var(--color-ink)',
                    textDecoration: 'none',
                    transition: 'color 150ms',
                    paddingBottom: '2px',
                    borderBottom: isActive ? '2px solid var(--color-red)' : '2px solid transparent',
                  }}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: 'var(--color-ink)',
          }}
          className="nav-mobile-toggle"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="3" y1="3" x2="19" y2="19" />
                <line x1="19" y1="3" x2="3" y2="19" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="19" y2="6" />
                <line x1="3" y1="11" x2="19" y2="11" />
                <line x1="3" y1="16" x2="19" y2="16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{
            background: 'var(--color-paper)',
            borderTop: '1px solid var(--color-hairline)',
            padding: '1.5rem 2rem',
          }}
        >
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {links.map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      color: isActive ? 'var(--color-red)' : 'var(--color-ink)',
                      textDecoration: 'none',
                    }}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .nav-desktop {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  )
}
