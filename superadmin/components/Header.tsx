'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  if (pathname === '/login') {
    return null
  }

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

  const isDirectory = pathname === '/' || pathname.startsWith('/organizations')
  const isActivity = pathname === '/activity'

  return (
    <header className="sticky top-1 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand / Academic Shield */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E10600] to-[#B30500] text-white flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-200">
              {/* Academic Crest / Shield SVG */}
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#E10600]">MITS</span>
                <span className="font-semibold text-lg text-slate-900 tracking-tight">Central Administration</span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                Muthoot Institute of Technology & Science
              </p>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isDirectory
                  ? 'bg-white text-[#E10600] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              <span>Campus Directory</span>
            </Link>

            <Link
              href="/activity"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActivity
                  ? 'bg-white text-[#E10600] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E10600]"></span>
              </span>
              <span>Live Activity</span>
            </Link>
          </nav>
        </div>

        {/* Right: Principal Profile & Sign Out */}
        <div className="flex items-center gap-4">
          {/* Principal Badge */}
          <div className="hidden sm:flex items-center gap-3 pl-3 pr-4 py-1.5 bg-slate-50 border border-slate-200/80 rounded-full shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E10600] to-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              P
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">Principal</div>
              <div className="text-[11px] text-slate-500 font-medium">Executive Admin</div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-[#E10600] hover:bg-red-50/70 border border-transparent hover:border-red-200 rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50"
            title="Sign Out of Central Administration"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
