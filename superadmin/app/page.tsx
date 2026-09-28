import { prisma } from '@/lib/prisma'
import OrganizationDirectory, { type OrgItem } from '@/components/OrganizationDirectory'

export const dynamic = 'force-dynamic'

export default async function DirectoryPage() {
  const [organizations, totalEvents, totalAchievements, totalActivityLogs] = await Promise.all([
    prisma.organization.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        activityLogs: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: { select: { events: true, achievements: true } },
      },
    }),
    prisma.event.count(),
    prisma.achievement.count(),
    prisma.activityLog.count(),
  ])

  const clubsCount = organizations.filter((o) => o.type === 'club').length
  const deptsCount = organizations.filter((o) => o.type === 'department').length

  const serializedOrgs: OrgItem[] = organizations.map((org) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    type: org.type,
    primaryColor: org.primaryColor,
    secondaryColor: org.secondaryColor,
    createdAt: org.createdAt.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    eventCount: org._count.events,
    achievementCount: org._count.achievements,
    lastActivityDate: org.activityLogs[0]?.createdAt
      ? org.activityLogs[0].createdAt.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })
      : null,
  }))

  return (
    <main className="space-y-8 pb-12">
      {/* Executive Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#990000] via-[#E10600] to-[#C30500] text-white p-8 sm:p-10 shadow-lg shadow-red-500/15">
        {/* Subtle decorative background circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 rounded-full bg-black/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold tracking-wide uppercase mb-4 border border-white/20">
            <span>🏛️</span> Office of the Principal &bull; Executive Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Institutional Web Governance
          </h1>
          <p className="text-sm sm:text-base text-red-100 font-normal mt-2 leading-relaxed max-w-2xl">
            Live overview and directory of all student bodies, academic societies, and departmental portals under Muthoot Institute of Technology & Science.
          </p>
        </div>
      </div>

      {/* KPI Stats Row (4 Executive Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Organizations */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Organizations
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E10600] flex items-center justify-center font-bold">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">{organizations.length}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              <span className="font-bold text-[#E10600]">{clubsCount}</span> Clubs &bull;{' '}
              <span className="font-bold text-blue-600">{deptsCount}</span> Departments
            </div>
          </div>
        </div>

        {/* Card 2: Campus Events */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Campus Events
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E10600] flex items-center justify-center font-bold">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">{totalEvents}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Scheduled across college portals
            </div>
          </div>
        </div>

        {/* Card 3: Student Accolades */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Achievements
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">{totalAchievements}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Awards & competition wins
            </div>
          </div>
        </div>

        {/* Card 4: Platform Activity */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Audit Logs
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">{totalActivityLogs}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Central audit trail active
            </div>
          </div>
        </div>
      </div>

      {/* Directory Section Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Registered Organizations
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Select any club or department to inspect published events, awards, and activity logs.
            </p>
          </div>
        </div>

        {/* Interactive Directory List & Search */}
        <OrganizationDirectory organizations={serializedOrgs} />
      </div>
    </main>
  )
}
