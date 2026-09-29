'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'

interface TopbarProps {
  onOpenMobile: () => void
}

export function Topbar({ onOpenMobile }: TopbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } finally {
      setLoggingOut(false)
    }
  }

  // Section titles and breadcrumb logic
  let sectionTitle = 'Organizations Directory'
  let breadcrumb = 'Campus Governance'
  if (pathname.startsWith('/organizations/')) {
    sectionTitle = 'Organization Dossier'
    breadcrumb = 'Organizations'
  } else if (pathname === '/activity') {
    sectionTitle = 'Live Activity Stream'
    breadcrumb = 'Central Audit'
  }

  return (
    <header
      className={`sticky top-0 z-20 transition-all duration-200 ${
        scrolled
          ? 'bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-xs'
          : 'bg-[var(--bg)] border-b border-[var(--border)]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Hamburger & Section Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted)]">
              <span>MITS Super Admin</span>
              <span>/</span>
              {pathname.startsWith('/organizations/') ? (
                <Link href="/" className="hover:text-[var(--ink)] hover:underline">
                  {breadcrumb}
                </Link>
              ) : (
                <span>{breadcrumb}</span>
              )}
            </div>
            <h1 className="text-sm sm:text-base font-semibold text-[var(--ink)] leading-tight tracking-tight">
              {sectionTitle}
            </h1>
          </div>
        </div>

        {/* Right: Theme Toggle, Principal Badge, Sign Out */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] border border-[var(--border)] rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] btn-press"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              /* Sun Icon */
              <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              /* Moon Icon */
              <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Principal Pill Badge */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-full">
            <div className="w-7 h-7 rounded-full bg-[var(--red)] text-white flex items-center justify-center font-bold text-xs shrink-0">
              P
            </div>
            <div className="text-left pr-1">
              <div className="text-xs font-semibold text-[var(--ink)] leading-tight">Dr. Principal</div>
              <div className="text-[10px] text-[var(--muted)] font-medium leading-tight">Institutional Head</div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--red)] hover:bg-[var(--red-tint)] border border-[var(--border)] hover:border-[var(--red)] rounded-lg transition-colors cursor-pointer disabled:opacity-50 btn-press focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)]"
            title="Sign out of Central Administration"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden sm:inline">{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
