import { prisma } from '@/lib/prisma'
import { describeAction } from '@/lib/formatActivity'
import { ActivityTimeline, type LogItem } from '@/components/ActivityTimeline'

export const dynamic = 'force-dynamic'

export default async function ActivityPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { organization: true, user: true },
  })

  const serializedLogs: LogItem[] = logs.map((log) => ({
    id: log.id,
    orgName: log.organization.name,
    orgSlug: log.organization.slug,
    orgType: log.organization.type,
    orgColor: log.organization.primaryColor,
    userName: log.user?.name ?? 'System Administrator',
    action: log.action,
    description: describeAction(log.action, log.details),
    date: log.createdAt.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    rawDate: log.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-md text-[11px] font-semibold tracking-wide uppercase text-[var(--red)] mb-3">
            <span>⚡</span> Central Audit Log &bull; Live Stream
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--ink)] leading-tight">
            Campus Activity Stream
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] font-normal mt-2 leading-relaxed">
            Live chronological record of all announcements, published events, awards, and branding changes across all college portals.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs font-semibold text-[var(--ink)] self-start md:self-auto shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="tabular-nums">{logs.length} Recorded Actions</span>
        </div>
      </div>

      {/* Activity Timeline List */}
      <ActivityTimeline logs={serializedLogs} />
    </div>
  )
}
