'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (pathname === '/login') {
    return <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">{children}</main>
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex">
      {/* 240px Fixed Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-60 min-w-0 flex flex-col min-h-screen">
        <Topbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 max-w-[1280px] w-full mx-auto p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
