'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { formatRelativeTime } from '@/lib/time'

export interface LogItem {
  id: string
  orgName: string
  orgSlug: string
  orgType: string
  orgColor: string
  userName: string
  action: string
  description: string
  date: string
  rawDate: string
}

export function ActivityTimeline({ logs }: { logs: LogItem[] }) {
  const router = useRouter()
  const [filterOrg, setFilterOrg] = useState<string>('all')
  const shouldReduceMotion = useReducedMotion()
  const isReducedMotion = !!shouldReduceMotion

  // Poll for updates while the activity feed is open
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 4000)
    return () => clearInterval(interval)
  }, [router])

  const orgNames = useMemo(() => {
    const set = new Set<string>()
    logs.forEach((l) => set.add(l.orgName))
    return Array.from(set).sort()
  }, [logs])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      return filterOrg === 'all' || log.orgName === filterOrg
    })
  }, [logs, filterOrg])

  function getActionIcon(action: string) {
    if (action.includes('event')) {
      return (
        <svg className="w-3.5 h-3.5 text-[var(--red)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    }
    if (action.includes('achievement')) {
      return (
        <svg className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      )
    }
    if (action.includes('logo') || action.includes('branding') || action.includes('color')) {
      return (
        <svg className="w-3.5 h-3.5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
      )
    }
    return (
      <svg className="w-3.5 h-3.5 text-[var(--muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  }

  return (
    <div className="space-y-4">
      {/* Restrained Filter Bar (Dropdown filter as specified in 4.4) */}
      <div className="p-3 sm:p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="orgFilterSelect" className="text-xs font-semibold text-[var(--muted)] whitespace-nowrap">
            Filter by Organization:
          </label>
          <select
            id="orgFilterSelect"
            value={filterOrg}
            onChange={(e) => setFilterOrg(e.target.value)}
            className="px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs font-medium text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] cursor-pointer"
          >
            <option value="all">All Organizations ({logs.length})</option>
            {orgNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-[var(--muted)] font-medium self-end sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live feed &bull; <span className="tabular-nums">{filteredLogs.length}</span> actions</span>
        </div>
      </div>

      {/* Feed Container */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden shadow-2xs">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-[var(--muted)] italic">
            No activity matches the selected organization filter.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)] p-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredLogs.map((log) => (
                <motion.li
                  key={log.id}
                  layout={!isReducedMotion}
                  initial={!isReducedMotion ? { opacity: 0, y: -16, scale: 0.98 } : undefined}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={!isReducedMotion ? { opacity: 0, scale: 0.96 } : undefined}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="py-3 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 row-hover rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Action Icon Pill */}
                    <div className="w-7 h-7 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0">
                      {getActionIcon(log.action)}
                    </div>

                    {/* Organization Tag Pill */}
                    <Link
                      href={`/organizations/${log.orgSlug}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)]"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: log.orgColor || '#E10600' }}
                      />
                      <span>{log.orgName}</span>
                    </Link>

                    {/* Action in Plain Language */}
                    <div className="text-xs text-[var(--ink)] leading-snug truncate">
                      <span className="font-semibold text-[var(--ink)]">{log.userName}</span>{' '}
                      <span className="text-[var(--muted)]">{log.description}</span>
                    </div>
                  </div>

                  {/* Relative Timestamp (Right-aligned, tabular figures) */}
                  <div className="text-left sm:text-right shrink-0 text-xs font-mono text-[var(--muted)] tabular-nums pl-10 sm:pl-0">
                    {formatRelativeTime(log.rawDate)}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  )
}
