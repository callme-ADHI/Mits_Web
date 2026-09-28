import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { describeAction } from '@/lib/formatActivity'

export const dynamic = 'force-dynamic'

export default async function OrgDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      events: { orderBy: { eventDate: 'desc' } },
      achievements: { orderBy: { achievementDate: 'desc' } },
      activityLogs: { orderBy: { createdAt: 'desc' }, take: 20, include: { user: true } },
    },
  })

  if (!org) return notFound()

  const isClub = org.type === 'club'

  return (
    <main className="space-y-8 pb-16">
      {/* Breadcrumb Back Navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors shadow-2xs"
        >
          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Return to Campus Directory</span>
        </Link>
      </div>

      {/* Organization Executive Dossier Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Dynamic Brand Color Banner */}
        <div
          className="h-24 sm:h-32 w-full relative"
          style={{ backgroundColor: org.primaryColor || '#E10600' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        </div>

        <div className="px-6 sm:px-10 pb-8 pt-0 relative">
          {/* Organization Avatar Crest */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-6">
            <div className="flex items-end gap-5">
              <div
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white text-3xl font-black shrink-0"
                style={{ backgroundColor: org.secondaryColor || '#111111' }}
              >
                {org.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {org.name}
                  </h1>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isClub
                        ? 'bg-red-50 text-[#E10600] border border-red-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {org.type}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Unique Slug: <span className="text-slate-700 font-semibold">/{org.slug}</span>
                </p>
              </div>
            </div>

            {/* Brand Colors Pill */}
            <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-600">
              <span className="text-[11px] font-bold uppercase text-slate-400">Palette:</span>
              <div className="flex items-center gap-1.5" title={`Primary: ${org.primaryColor}`}>
                <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: org.primaryColor }} />
                <span className="font-mono text-[11px]">{org.primaryColor}</span>
              </div>
              <span className="text-slate-300">&bull;</span>
              <div className="flex items-center gap-1.5" title={`Secondary: ${org.secondaryColor}`}>
                <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: org.secondaryColor }} />
                <span className="font-mono text-[11px]">{org.secondaryColor}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {org.description ? (
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {org.description}
            </p>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No formal description provided by the club administration yet.
            </p>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 max-w-xl">
            <div>
              <div className="text-2xl font-black text-slate-900">{org.events.length}</div>
              <div className="text-xs text-slate-500 font-semibold">Published Events</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{org.achievements.length}</div>
              <div className="text-xs text-slate-500 font-semibold">Recorded Accolades</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{org.activityLogs.length}</div>
              <div className="text-xs text-slate-500 font-semibold">Audit Actions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Events & Achievements Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Events */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#E10600] flex items-center justify-center font-bold">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                  Events ({org.events.length})
                </h2>
                <p className="text-xs text-slate-400">Campus workshops, fests, and competitions</p>
              </div>
            </div>
          </div>

          {org.events.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No campus events currently recorded for this organization.
            </div>
          ) : (
            <div className="space-y-3">
              {org.events.map((e) => {
                const isUpcoming = e.status === 'upcoming'
                return (
                  <div
                    key={e.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{e.title}</span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            isUpcoming
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {e.status}
                        </span>
                      </div>
                      {e.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {e.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-slate-700">
                        {e.eventDate.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Section 2: Achievements */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                  Achievements ({org.achievements.length})
                </h2>
                <p className="text-xs text-slate-400">Accolades won by college students</p>
              </div>
            </div>
          </div>

          {org.achievements.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No accolades recorded for this organization yet.
            </div>
          ) : (
            <div className="space-y-3">
              {org.achievements.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-xl border border-amber-200/60 bg-amber-50/20 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      🏆
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{a.title}</div>
                      {a.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {a.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 text-xs font-semibold text-slate-600">
                    {a.achievementDate.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Administrative Activity Trail */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
              Administrative Audit Log
            </h2>
            <p className="text-xs text-slate-400">Recent actions performed by organization administrators</p>
          </div>
        </div>

        {org.activityLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs italic">
            No administrative activities logged for this organization.
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {org.activityLogs.map((log, index) => {
                const isLast = index === org.activityLogs.length - 1
                return (
                  <li key={log.id}>
                    <div className="relative pb-8">
                      {!isLast && (
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[#E10600] shrink-0 text-xs font-bold">
                          {log.user?.name ? log.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="text-xs text-slate-800">
                            <span className="font-bold text-slate-900">
                              {log.user?.name ?? 'System Administrator'}
                            </span>{' '}
                            <span className="text-slate-600">
                              {describeAction(log.action, log.details)}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {log.createdAt.toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
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
    </main>
  )
}
