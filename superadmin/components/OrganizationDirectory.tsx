'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { formatRelativeTime } from '@/lib/time'

export interface OrgItem {
  id: string
  name: string
  slug: string
  type: string
  primaryColor: string
  secondaryColor: string
  createdAt: string
  eventCount: number
  achievementCount: number
  lastActivityDate: string | null
  lastActivityRaw: string | null
}

type SortField = 'name' | 'type' | 'eventCount' | 'achievementCount' | 'lastActivity'
type SortOrder = 'asc' | 'desc'

let hasTableAnimatedOnce = false

export function OrganizationDirectory({ organizations }: { organizations: OrgItem[] }) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'club' | 'department'>('all')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const shouldReduceMotion = useReducedMotion()
  const isReducedMotion = !!shouldReduceMotion

  // Stagger on initial load only
  const shouldAnimate = !hasTableAnimatedOnce && !isReducedMotion
  useEffect(() => {
    hasTableAnimatedOnce = true
  }, [])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder(field === 'eventCount' || field === 'achievementCount' || field === 'lastActivity' ? 'desc' : 'asc')
    }
  }

  const counts = useMemo(() => {
    return {
      all: organizations.length,
      club: organizations.filter((o) => o.type === 'club').length,
      department: organizations.filter((o) => o.type === 'department').length,
    }
  }, [organizations])

  const filteredAndSortedOrgs = useMemo(() => {
    const filtered = organizations.filter((org) => {
      const query = search.trim().toLowerCase()
      const matchesSearch =
        query === '' ||
        org.name.toLowerCase().includes(query) ||
        org.slug.toLowerCase().includes(query)
      const matchesType = filterType === 'all' || org.type === filterType
      return matchesSearch && matchesType
    })

    return filtered.sort((a, b) => {
      let comparison = 0
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortField === 'type') {
        comparison = a.type.localeCompare(b.type)
      } else if (sortField === 'eventCount') {
        comparison = a.eventCount - b.eventCount
      } else if (sortField === 'achievementCount') {
        comparison = a.achievementCount - b.achievementCount
      } else if (sortField === 'lastActivity') {
        const timeA = a.lastActivityRaw ? new Date(a.lastActivityRaw).getTime() : 0
        const timeB = b.lastActivityRaw ? new Date(b.lastActivityRaw).getTime() : 0
        comparison = timeA - timeB
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [organizations, search, filterType, sortField, sortOrder])

  return (
    <div className="space-y-4">
      {/* Control Bar: Filter Pills + Search */}
      <div className="p-3 sm:p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap btn-press focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] ${
              filterType === 'all'
                ? 'bg-[var(--surface)] text-[var(--red)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            All <span className="tabular-nums">({counts.all})</span>
          </button>
          <button
            onClick={() => setFilterType('club')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap btn-press focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] ${
              filterType === 'club'
                ? 'bg-[var(--surface)] text-[var(--red)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            Clubs <span className="tabular-nums">({counts.club})</span>
          </button>
          <button
            onClick={() => setFilterType('department')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap btn-press focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] ${
              filterType === 'department'
                ? 'bg-[var(--surface)] text-[var(--red)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            Departments <span className="tabular-nums">({counts.department})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or slug..."
            className="w-full pl-9 pr-8 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs font-medium text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] focus:border-[var(--red)] transition-all"
            aria-label="Filter organizations by name or slug"
          />
          <svg className="w-4 h-4 text-[var(--muted)] absolute left-3 top-2.5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-[var(--muted)] hover:text-[var(--ink)] text-xs p-0.5"
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface)] text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider sticky top-0 z-10 select-none">
                {/* Organization Header - Left Aligned */}
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-6 text-left cursor-pointer hover:text-[var(--ink)] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Organization</span>
                    {sortField === 'name' && (
                      <span className="text-[var(--red)] text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>

                {/* Type Header - Left Aligned */}
                <th
                  onClick={() => handleSort('type')}
                  className="py-3.5 px-4 text-left cursor-pointer hover:text-[var(--ink)] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Type</span>
                    {sortField === 'type' && (
                      <span className="text-[var(--red)] text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>

                {/* Events Header - Right Aligned */}
                <th
                  onClick={() => handleSort('eventCount')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-[var(--ink)] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Events</span>
                    {sortField === 'eventCount' && (
                      <span className="text-[var(--red)] text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>

                {/* Achievements Header - Right Aligned */}
                <th
                  onClick={() => handleSort('achievementCount')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-[var(--ink)] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Achievements</span>
                    {sortField === 'achievementCount' && (
                      <span className="text-[var(--red)] text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>

                {/* Last Activity Header - Right Aligned */}
                <th
                  onClick={() => handleSort('lastActivity')}
                  className="py-3.5 px-6 text-right cursor-pointer hover:text-[var(--ink)] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Last Activity</span>
                    {sortField === 'lastActivity' && (
                      <span className="text-[var(--red)] text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>

                {/* Action Header - Right Aligned */}
                <th className="py-3.5 px-6 text-right">
                  <span>Action</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border)]">
              {filteredAndSortedOrgs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--muted)] italic">
                    No organizations match your criteria.
                  </td>
                </tr>
              ) : (
                filteredAndSortedOrgs.map((org, index) => {
                  const isClub = org.type === 'club'
                  const relativeActivity = formatRelativeTime(org.lastActivityRaw)

                  const rowInitial = shouldAnimate ? { opacity: 0, y: 6 } : undefined
                  const rowAnimate = { opacity: 1, y: 0 }
                  const rowTransition = shouldAnimate
                    ? { duration: 0.3, delay: index * 0.04, ease: 'easeOut' as const }
                    : { duration: 0.15 }

                  return (
                    <motion.tr
                      key={org.id}
                      layout={!isReducedMotion}
                      initial={rowInitial}
                      animate={rowAnimate}
                      transition={rowTransition}
                      className="row-hover group"
                    >
                      {/* Organization Name + Slug + Brand Dot */}
                      <td className="py-4 px-6 text-left">
                        <Link
                          href={`/organizations/${org.slug}`}
                          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] rounded"
                        >
                          <motion.span
                            layoutId={!isReducedMotion ? `org-swatch-${org.slug}` : undefined}
                            className="w-3.5 h-3.5 rounded-full border border-[var(--border)] shrink-0"
                            style={{ backgroundColor: org.primaryColor || '#E10600' }}
                            title={`Brand color: ${org.primaryColor}`}
                          />
                          <div>
                            <div className="font-semibold text-sm text-[var(--ink)] group-hover:text-[var(--red)] transition-colors leading-tight">
                              {org.name}
                            </div>
                            <div className="text-[11px] font-mono text-[var(--muted)] mt-0.5">
                              /{org.slug}
                            </div>
                          </div>
                        </Link>
                      </td>

                      {/* Type Badge */}
                      <td className="py-4 px-4 text-left">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            isClub
                              ? 'bg-[var(--red-tint)] text-[var(--red)]'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {org.type}
                        </span>
                      </td>

                      {/* Events Count (Right-aligned, tabular-nums) */}
                      <td className="py-4 px-4 text-right font-medium text-[var(--ink)] tabular-nums">
                        {org.eventCount}
                      </td>

                      {/* Achievements Count (Right-aligned, tabular-nums) */}
                      <td className="py-4 px-4 text-right font-medium text-[var(--ink)] tabular-nums">
                        {org.achievementCount}
                      </td>

                      {/* Last Activity (Right-aligned, relative time) */}
                      <td className="py-4 px-6 text-right text-[var(--muted)] tabular-nums">
                        {relativeActivity}
                      </td>

                      {/* Action Chevron Button (Right-aligned, vertically centered) */}
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/organizations/${org.slug}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[var(--muted)] group-hover:text-[var(--red)] hover:bg-[var(--surface)] border border-transparent group-hover:border-[var(--border)] transition-all btn-press focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)]"
                        >
                          <span>Dossier</span>
                          <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </Link>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
