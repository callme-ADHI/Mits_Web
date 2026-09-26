'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/login') {
    return null
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="font-bold text-lg text-slate-900 tracking-tight">
            MITS <span className="text-slate-500 font-normal">Super Admin</span>
          </Link>
          <nav className="flex space-x-4 text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                pathname === '/' || pathname.startsWith('/organizations')
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Organizations
            </Link>
            <Link
              href="/activity"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                pathname === '/activity'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Activity Feed
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  )
}
