'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { formatRelativeTime } from '@/lib/time'

interface EventItem {
  id: string
  title: string
  description: string | null
  eventDate: string
  status: string
}

interface AchievementItem {
  id: string
  title: string
  description: string | null
  achievementDate: string
}

interface ActivityItem {
  id: string
  action: string
  description: string
  userName: string
  createdAt: string
}

interface OrgDetailData {
  id: string
  name: string
  slug: string
  type: string
  description: string | null
  primaryColor: string
  secondaryColor: string
  contactEmail: string | null
  events: EventItem[]
  achievements: AchievementItem[]
  activityLogs: ActivityItem[]
}

export function OrgDetailView({ org }: { org: OrgDetailData }) {
  const shouldReduceMotion = useReducedMotion()
  const isReducedMotion = !!shouldReduceMotion
  const isClub = org.type === 'club'

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb Back Navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)] text-xs font-semibold transition-colors btn-press focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)]"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Return to Organizations</span>
        </Link>
      </div>

      {/* Header Dossier Card (Shared Element Target) */}
      <motion.div
        layoutId={!isReducedMotion ? `org-card-${org.slug}` : undefined}
        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8"
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div className="flex items-start gap-4">
            {/* Organization Monogram Crest */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--ink)] bg-[var(--bg)] font-bold text-xl sm:text-2xl shrink-0"
            >
              {org.name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight">
                  {org.name}
                </h1>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    isClub
                      ? 'bg-[var(--red-tint)] text-[var(--red)]'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  }`}
                >
                  {org.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)] mt-1">
                <span>Unique slug:</span>
                <span className="font-semibold text-[var(--ink)]">/{org.slug}</span>
                {org.contactEmail && (
                  <>
                    <span>&bull;</span>
                    <span className="font-sans text-[var(--muted)]">{org.contactEmail}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stored Visual Identity Swatch (Data only, not applied as app theme) */}
          <div className="flex items-center gap-3 px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs self-start">
            <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">Palette:</span>
            <div className="flex items-center gap-1.5" title={`Primary brand color: ${org.primaryColor}`}>
              <motion.span
                layoutId={!isReducedMotion ? `org-swatch-${org.slug}` : undefined}
                className="w-3.5 h-3.5 rounded-full border border-[var(--border)] inline-block"
                style={{ backgroundColor: org.primaryColor }}
              />
              <span className="font-mono text-[11px] text-[var(--ink)] uppercase">{org.primaryColor}</span>
            </div>
            <span className="text-[var(--border)]">&bull;</span>
            <div className="flex items-center gap-1.5" title={`Secondary brand color: ${org.secondaryColor}`}>
              <span
                className="w-3.5 h-3.5 rounded-full border border-[var(--border)] inline-block"
                style={{ backgroundColor: org.secondaryColor }}
              />
              <span className="font-mono text-[11px] text-[var(--ink)] uppercase">{org.secondaryColor}</span>
            </div>
          </div>
        </div>

        {/* Description & Metrics Strip */}
        <div className="pt-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            {org.description ? (
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {org.description}
              </p>
            ) : (
              <p className="text-xs text-[var(--muted)] italic">
                No formal organization description provided yet.
              </p>
            )}
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-6 sm:gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-[var(--border)] shrink-0">
            <div>
              <div className="text-xl font-semibold text-[var(--ink)] tabular-nums leading-none mb-1">
                {org.events.length}
              </div>
              <div className="text-[11px] text-[var(--muted)] font-medium">Events</div>
            </div>
            <div className="w-px h-8 bg-[var(--border)]" />
            <div>
              <div className="text-xl font-semibold text-[var(--ink)] tabular-nums leading-none mb-1">
                {org.achievements.length}
              </div>
              <div className="text-[11px] text-[var(--muted)] font-medium">Accolades</div>
            </div>
            <div className="w-px h-8 bg-[var(--border)]" />
            <div>
              <div className="text-xl font-semibold text-[var(--ink)] tabular-nums leading-none mb-1">
                {org.activityLogs.length}
              </div>
              <div className="text-[11px] text-[var(--muted)] font-medium">Audit Logs</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two-Column Scannable Lists: Events & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: Published Events */}
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--red)] flex items-center justify-center font-bold">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--ink)]">
                  Published Events <span className="tabular-nums font-normal text-[var(--muted)]">({org.events.length})</span>
                </h2>
                <p className="text-[11px] text-[var(--muted)]">Scheduled campus workshops, fests, & talks</p>
              </div>
            </div>
          </div>

          {org.events.length === 0 ? (
            <div className="py-10 text-center text-xs text-[var(--muted)] italic bg-[var(--bg)] rounded-xl border border-dashed border-[var(--border)]">
              No campus events currently recorded for this organization.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {org.events.map((e) => {
                const isUpcoming = e.status === 'upcoming'
                return (
                  <div key={e.id} className="py-3 flex items-start justify-between gap-4 row-hover px-2 rounded-lg">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[var(--ink)] truncate">{e.title}</span>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                            isUpcoming
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)]'
                          }`}
                        >
                          {e.status}
                        </span>
                      </div>
                      {e.description && (
                        <p className="text-[11px] text-[var(--muted)] mt-0.5 line-clamp-1">
                          {e.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0 text-xs font-mono text-[var(--muted)] tabular-nums pt-0.5">
                      {e.eventDate}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Column 2: Recorded Accolades */}
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-amber-500 flex items-center justify-center font-bold">
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
                <h2 className="text-sm font-semibold text-[var(--ink)]">
                  Achievements <span className="tabular-nums font-normal text-[var(--muted)]">({org.achievements.length})</span>
                </h2>
                <p className="text-[11px] text-[var(--muted)]">Student competition awards & honors</p>
              </div>
            </div>
          </div>

          {org.achievements.length === 0 ? (
            <div className="py-10 text-center text-xs text-[var(--muted)] italic bg-[var(--bg)] rounded-xl border border-dashed border-[var(--border)]">
              No accolades recorded for this organization yet.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {org.achievements.map((a) => (
                <div key={a.id} className="py-3 flex items-start justify-between gap-4 row-hover px-2 rounded-lg">
                  <div className="min-w-0">
                    <span className="font-semibold text-xs text-[var(--ink)] truncate block">{a.title}</span>
                    {a.description && (
                      <p className="text-[11px] text-[var(--muted)] mt-0.5 line-clamp-1">
                        {a.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0 text-xs font-mono text-[var(--muted)] tabular-nums pt-0.5">
                    {a.achievementDate}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Organization Recent Activity Audit Panel */}
      <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] flex items-center justify-center font-bold">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--ink)]">
              Recent Activity for {org.name}
            </h2>
            <p className="text-[11px] text-[var(--muted)]">Audit trail of actions taken by organization administrators</p>
          </div>
        </div>

        {org.activityLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--muted)] italic bg-[var(--bg)] rounded-xl border border-dashed border-[var(--border)]">
            No administrative activities recorded for this organization.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {org.activityLogs.map((log) => (
              <div key={log.id} className="py-3 px-2 flex items-center justify-between gap-4 row-hover rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--red)] font-semibold text-xs flex items-center justify-center shrink-0">
                    {log.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--ink)] leading-snug truncate">
                      <span className="font-semibold">{log.userName}</span>{' '}
                      <span className="text-[var(--muted)]">{log.description}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 text-[11px] font-mono text-[var(--muted)] tabular-nums">
                  {formatRelativeTime(log.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
