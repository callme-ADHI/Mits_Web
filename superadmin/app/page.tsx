import { prisma } from '@/lib/prisma'
import { OrganizationDirectory, type OrgItem } from '@/components/OrganizationDirectory'
import { StatCounter } from '@/components/StatCounter'

export const dynamic = 'force-dynamic'

function getOneWeekAgo(): Date {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
}

export default async function DirectoryPage() {
  const oneWeekAgo = getOneWeekAgo()

  const [organizations, totalEvents, totalAchievements, recentWeeklyLogs] = await Promise.all([
    prisma.organization.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        activityLogs: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: { select: { events: true, achievements: true } },
      },
    }),
    prisma.event.count(),
    prisma.achievement.count(),
    prisma.activityLog.findMany({
      where: { createdAt: { gte: oneWeekAgo } },
      select: { organizationId: true },
    }),
  ])

  const clubsCount = organizations.filter((o) => o.type === 'club').length
  const deptsCount = organizations.filter((o) => o.type === 'department').length

  // Calculate most active organization this week
  let mostActiveOrgName = 'No activity this week'
  let mostActiveCount = 0

  if (recentWeeklyLogs.length > 0) {
    const countsMap = new Map<string, number>()
    for (const log of recentWeeklyLogs) {
      countsMap.set(log.organizationId, (countsMap.get(log.organizationId) || 0) + 1)
    }
    let topOrgId = ''
    let max = 0
    countsMap.forEach((count, orgId) => {
      if (count > max) {
        max = count
        topOrgId = orgId
      }
    })
    const topOrg = organizations.find((o) => o.id === topOrgId)
    if (topOrg) {
      mostActiveOrgName = `${topOrg.name} (${max} actions)`
      mostActiveCount = max
    }
  } else {
    // Fallback: check most recent organization with activity
    const latestOrg = organizations.find((o) => o.activityLogs.length > 0)
    if (latestOrg) {
      mostActiveOrgName = `Latest: ${latestOrg.name}`
    }
  }

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
      ? org.activityLogs[0].createdAt.toISOString()
      : null,
    lastActivityRaw: org.activityLogs[0]?.createdAt
      ? org.activityLogs[0].createdAt.toISOString()
      : null,
  }))

  return (
    <div className="space-y-8 pb-12">
      {/* Formal Executive Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-md text-[11px] font-semibold tracking-wide uppercase text-[var(--red)] mb-3">
            <span>🏛️</span> Office of the Principal &bull; Executive Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--ink)] leading-tight">
            Institutional Web Governance
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] font-normal mt-2 leading-relaxed">
            Central institutional oversight and directory of all student societies, technical chapters, and academic departmental portals under Muthoot Institute of Technology & Science.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs font-medium text-[var(--muted)] self-start md:self-auto shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Institutional Session</span>
        </div>
      </div>

      {/* KPI Stats Row (4 Restrained Executive Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Organizations */}
        <StatCounter
          value={organizations.length}
          label="Total Organizations"
          subtext={`${clubsCount} Clubs · ${deptsCount} Departments`}
          icon={
            <svg className="w-4 h-4 text-[var(--red)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          }
        />

        {/* Total Events */}
        <StatCounter
          value={totalEvents}
          label="Campus Events"
          subtext="Published across college portals"
          icon={
            <svg className="w-4 h-4 text-[var(--red)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />

        {/* Total Achievements */}
        <StatCounter
          value={totalAchievements}
          label="Student Accolades"
          subtext="Awards & competition honors"
          icon={
            <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          }
        />

        {/* Most Active This Week */}
        <StatCounter
          value={mostActiveCount}
          label="Weekly Actions"
          subtext={mostActiveOrgName}
          icon={
            <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />
      </div>

      {/* Directory Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--ink)] tracking-tight">
              Registered Organizations
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Click any organization row to inspect detailed records, events, accolades, and audit trails.
            </p>
          </div>
        </div>

        <OrganizationDirectory organizations={serializedOrgs} />
      </div>
    </div>
  )
}
