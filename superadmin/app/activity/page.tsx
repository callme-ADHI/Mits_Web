import { prisma } from '@/lib/prisma'
import { describeAction } from '@/lib/formatActivity'

export default async function ActivityPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { organization: true, user: true },
  })

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Activity feed</h1>
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        {logs.length === 0 ? (
          <p className="text-sm text-slate-500">No activity logs found across the platform.</p>
        ) : (
          <ul className="space-y-3 divide-y divide-slate-100">
            {logs.map((log, index) => (
              <li key={log.id} className={`text-sm ${index > 0 ? 'pt-3' : ''}`}>
                <span className="font-semibold text-slate-900">{log.organization.name}</span>
                {' — '}
                <span className="text-slate-800">{log.user?.name ?? 'Someone'}</span>{' '}
                <span className="text-slate-700">{describeAction(log.action, log.details)}</span>
                {' — '}
                <span className="text-slate text-xs">{log.createdAt.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
