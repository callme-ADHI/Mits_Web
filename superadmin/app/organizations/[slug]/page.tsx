import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

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

  return (
    <main className="p-8">
      <a href="/" className="text-sm text-slate hover:underline">← Back to all organizations</a>
      <h1 className="text-2xl font-bold mt-2 mb-1 text-slate-900">{org.name}</h1>
      <p className="text-slate mb-6">{org.description}</p>

      <section className="mb-8 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="font-semibold text-lg mb-3 text-slate-900">Events ({org.events.length})</h2>
        {org.events.length === 0 ? (
          <p className="text-sm text-slate-500">No events found.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {org.events.map((e) => (
              <li key={e.id} className="text-slate-800">
                <span className="font-medium">{e.title}</span> — {e.eventDate.toLocaleDateString()} — <span className="text-slate capitalize font-normal">{e.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="font-semibold text-lg mb-3 text-slate-900">Achievements ({org.achievements.length})</h2>
        {org.achievements.length === 0 ? (
          <p className="text-sm text-slate-500">No achievements recorded.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {org.achievements.map((a) => (
              <li key={a.id} className="text-slate-800">
                <span className="font-medium">{a.title}</span> — {a.achievementDate.toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="font-semibold text-lg mb-3 text-slate-900">Recent activity</h2>
        {org.activityLogs.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity recorded for this organization.</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate">
            {org.activityLogs.map((log) => (
              <li key={log.id} className="text-slate-700">
                <span className="font-medium text-slate-900">{log.user?.name ?? 'Someone'}</span> — <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{log.action}</span> — <span className="text-slate text-xs">{log.createdAt.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
