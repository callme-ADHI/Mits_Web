import { prisma } from '@/lib/prisma'
import { describeAction } from '@/lib/formatActivity'
import ActivityTimeline, { type LogItem } from '@/components/ActivityTimeline'

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
    userName: log.user?.name ?? 'Administrator',
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
    <main className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-[#E10600] border border-red-100 mb-2">
            <span>⚡</span> Real-time Audit Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Campus Activity Stream
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Live chronological record of all announcements, events, and student awards published across MITS portals.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{logs.length} Total Platform Actions</span>
        </div>
      </div>

      {/* Interactive Timeline */}
      <ActivityTimeline logs={serializedLogs} />
    </main>
  )
}
