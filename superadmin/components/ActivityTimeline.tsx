'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

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

export default function ActivityTimeline({ logs }: { logs: LogItem[] }) {
  const [filterOrg, setFilterOrg] = useState<string>('all')
  const [search, setSearch] = useState<string>('')

  const orgNames = useMemo(() => {
    const set = new Set<string>()
    logs.forEach((l) => set.add(l.orgName))
    return Array.from(set).sort()
  }, [logs])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchOrg = filterOrg === 'all' || log.orgName === filterOrg
      const matchSearch =
        search === '' ||
        log.orgName.toLowerCase().includes(search.toLowerCase()) ||
        log.userName.toLowerCase().includes(search.toLowerCase()) ||
        log.description.toLowerCase().includes(search.toLowerCase())
      return matchOrg && matchSearch
    })
  }, [logs, filterOrg, search])

  function getActionBadge(action: string) {
    if (action.includes('event')) {
      return {
        icon: '📅',
        label: 'Event',
        bg: 'bg-red-50 text-[#E10600] border-red-200',
      }
    }
    if (action.includes('achievement')) {
      return {
        icon: '🏆',
        label: 'Award',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
      }
    }
    if (action.includes('logo') || action.includes('branding') || action.includes('color')) {
      return {
        icon: '🎨',
        label: 'Branding',
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
      }
    }
    if (action.includes('message') || action.includes('contact')) {
      return {
        icon: '✉️',
        label: 'Message',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
      }
    }
    return {
      icon: '⚙️',
      label: 'System',
      bg: 'bg-slate-50 text-slate-700 border-slate-200',
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Organization Filter Select */}
        <div className="flex items-center gap-2">
          <label htmlFor="orgFilter" className="text-xs font-bold text-slate-600 whitespace-nowrap">
            Filter by Club:
          </label>
          <select
            id="orgFilter"
            value={filterOrg}
            onChange={(e) => setFilterOrg(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E10600] cursor-pointer"
          >
            <option value="all">All Organizations ({logs.length} actions)</option>
            {orgNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity description..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E10600] focus:border-[#E10600] focus:bg-white transition-all"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs italic">
            No activity matches the selected filters.
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {filteredLogs.map((log, index) => {
                const isLast = index === filteredLogs.length - 1
                const badge = getActionBadge(log.action)
                return (
                  <li key={log.id}>
                    <div className="relative pb-8">
                      {!isLast && (
                        <span
                          className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex items-start space-x-4">
                        {/* Action Category Icon Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs text-lg">
                          {badge.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Link
                              href={`/organizations/${log.orgSlug}`}
                              className="font-extrabold text-sm text-slate-900 hover:text-[#E10600] transition-colors"
                            >
                              {log.orgName}
                            </Link>

                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badge.bg}`}
                            >
                              {badge.label}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed">
                            <span className="font-semibold text-slate-900">{log.userName}</span>{' '}
                            {log.description}
                          </p>

                          <div className="text-[11px] text-slate-400 font-mono mt-1">
                            {log.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
