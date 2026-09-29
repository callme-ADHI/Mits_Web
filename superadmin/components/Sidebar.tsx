'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Organizations',
    description: 'Campus directory & dossiers',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    href: '/activity',
    label: 'Activity',
    description: 'Central audit & event feed',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
]

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[var(--surface)] text-[var(--ink)]">
      <div>
        {/* Institutional Crest & Brand Header */}
        <div className="p-5 border-b border-[var(--border)]">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] rounded-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#990000] via-[#E10600] to-[#FF4D4D] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-[1.02] transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-[var(--red)]">MITS</span>
                <span className="font-semibold text-xs tracking-tight text-[var(--ink)] truncate">Central Admin</span>
              </div>
              <p className="text-[11px] text-[var(--muted)] font-medium truncate mt-0.5">
                Executive Governance
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items with Sliding Indicator */}
        <div className="p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] px-3 py-2">
            Navigation
          </div>
          <nav className="relative flex flex-col gap-1" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/' || pathname.startsWith('/organizations')
                  : pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] ${
                    active
                      ? 'text-[var(--red)]'
                      : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg)]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-[var(--red-tint)] rounded-lg pointer-events-none"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <div className="relative z-10 flex flex-col">
                    <span className="leading-tight">{item.label}</span>
                    <span className="text-[10px] font-normal text-[var(--muted)] opacity-80 leading-tight">
                      {item.description}
                    </span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Footer Institution Tag */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="text-[10px] text-[var(--muted)] flex items-center justify-between">
          <span className="font-medium">Muthoot Institute</span>
          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-[var(--bg)] border border-[var(--border)] rounded">v1.0</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar (240px = w-60) */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-60 border-r border-[var(--border)] z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer (<1024px) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 left-0 w-64 max-w-[80vw] shadow-2xl z-50">
            {sidebarContent}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-[var(--muted)] hover:text-[var(--ink)] bg-[var(--bg)] border border-[var(--border)] rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)]"
              aria-label="Close navigation sidebar"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
