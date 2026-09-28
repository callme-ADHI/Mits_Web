'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

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
}

export default function OrganizationDirectory({ organizations }: { organizations: OrgItem[] }) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'club' | 'department'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.slug.toLowerCase().includes(search.toLowerCase())
      const matchesType = filterType === 'all' || org.type === filterType
      return matchesSearch && matchesType
    })
  }, [organizations, search, filterType])

  const counts = useMemo(() => {
    return {
      all: organizations.length,
      club: organizations.filter((o) => o.type === 'club').length,
      department: organizations.filter((o) => o.type === 'department').length,
    }
  }, [organizations])

  return (
    <div className="space-y-6">
      {/* Control Bar: Search & Category Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-white text-[#E10600] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Organizations ({counts.all})
          </button>
          <button
            onClick={() => setFilterType('club')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'club'
                ? 'bg-white text-[#E10600] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clubs ({counts.club})
          </button>
          <button
            onClick={() => setFilterType('department')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'department'
                ? 'bg-white text-[#E10600] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Departments ({counts.department})
          </button>
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or slug..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E10600] focus:border-[#E10600] focus:bg-white transition-all"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Grid / Table view toggle */}
          <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-[#E10600] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-[#E10600] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrgs.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-[#E10600] flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-800">No organizations found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No club or department matched your search query &ldquo;{search}&rdquo;. Try clearing filters.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setFilterType('all')
            }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Grid View */}
      {filteredOrgs.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => {
            const isClub = org.type === 'club'
            return (
              <div
                key={org.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                {/* Brand Color Header Ribbon */}
                <div
                  className="h-3 w-full"
                  style={{ backgroundColor: org.primaryColor || '#E10600' }}
                />

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Top Row: Type Badge + Color Pill */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                          isClub
                            ? 'bg-red-50 text-[#E10600] border border-red-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}
                      >
                        {org.type}
                      </span>
                      <div className="flex items-center gap-1.5" title={`Brand color: ${org.primaryColor}`}>
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-200 shadow-2xs inline-block"
                          style={{ backgroundColor: org.primaryColor }}
                        />
                        <span className="text-[11px] font-mono text-slate-400 uppercase">
                          {org.primaryColor}
                        </span>
                      </div>
                    </div>

                    {/* Name & Slug */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#E10600] transition-colors leading-snug">
                      <Link href={`/organizations/${org.slug}`}>{org.name}</Link>
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">/{org.slug}</p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-3 my-5 py-3 border-y border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E10600] flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-slate-900 leading-tight">
                          {org.eventCount}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">Events</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                          <path d="M4 22h16" />
                          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-slate-900 leading-tight">
                          {org.achievementCount}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">Awards</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer: Activity + Action */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-slate-500 truncate" title={org.lastActivityDate || 'No activity'}>
                      {org.lastActivityDate ? `Active ${org.lastActivityDate}` : 'No activity yet'}
                    </span>
                    <Link
                      href={`/organizations/${org.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-[#E10600] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                    >
                      <span>View Dossier</span>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Table View */}
      {filteredOrgs.length > 0 && viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Organization</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-center">Events</th>
                <th className="py-3.5 px-4 text-center">Achievements</th>
                <th className="py-3.5 px-6">Last Activity</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredOrgs.map((org) => {
                const isClub = org.type === 'club'
                return (
                  <tr key={org.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-200 shadow-2xs shrink-0"
                          style={{ backgroundColor: org.primaryColor || '#E10600' }}
                          title={`Brand color: ${org.primaryColor}`}
                        />
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">
                            <Link href={`/organizations/${org.slug}`} className="hover:text-[#E10600] transition-colors">
                              {org.name}
                            </Link>
                          </div>
                          <div className="text-xs font-mono text-slate-400">/{org.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                          isClub
                            ? 'bg-red-50 text-[#E10600] border border-red-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}
                      >
                        {org.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800">
                      {org.eventCount}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800">
                      {org.achievementCount}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {org.lastActivityDate ? org.lastActivityDate : 'No activity yet'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/organizations/${org.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#E10600] hover:text-red-700 hover:underline"
                      >
                        <span>Dossier</span>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
