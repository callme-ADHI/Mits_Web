import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ORG_ID } from '@/lib/env'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const org = await prisma.organization.findUnique({
    where: { id: ORG_ID },
  })

  const [totalEvents, upcomingEvents, totalAchievements, unreadMessages, activityLogs] = await Promise.all([
    prisma.event.count({ where: { organizationId: ORG_ID } }),
    prisma.event.count({
      where: { organizationId: ORG_ID, status: 'upcoming' },
    }),
    prisma.achievement.count({ where: { organizationId: ORG_ID } }),
    prisma.contactMessage.count({ where: { organizationId: ORG_ID, isRead: false } }),
    prisma.activityLog.findMany({
      where: { organizationId: ORG_ID },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { user: true },
    }),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">{org?.name} Admin Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage your public website content, events, achievements, messages, and branding.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-slate-200 p-5">
          <dt className="text-sm font-medium text-slate-500 truncate">Total Events</dt>
          <dd className="mt-1 text-3xl font-semibold text-slate-900">{totalEvents}</dd>
          <div className="mt-3">
            <Link href="/events" className="text-xs text-red-600 font-medium hover:underline">
              View all events →
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-slate-200 p-5">
          <dt className="text-sm font-medium text-slate-500 truncate">Upcoming Events</dt>
          <dd className="mt-1 text-3xl font-semibold text-red-600">{upcomingEvents}</dd>
          <div className="mt-3">
            <Link href="/events" className="text-xs text-red-600 font-medium hover:underline">
              Manage schedule →
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-slate-200 p-5">
          <dt className="text-sm font-medium text-slate-500 truncate">Achievements</dt>
          <dd className="mt-1 text-3xl font-semibold text-slate-900">{totalAchievements}</dd>
          <div className="mt-3">
            <Link href="/achievements" className="text-xs text-red-600 font-medium hover:underline">
              View trophies & wins →
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-slate-200 p-5">
          <dt className="text-sm font-medium text-slate-500 truncate">Contact Messages</dt>
          <dd className="mt-1 text-3xl font-semibold text-slate-900">
            {unreadMessages} <span className="text-xs font-normal text-slate-500">unread</span>
          </dd>
          <div className="mt-3">
            <Link href="/messages" className="text-xs text-red-600 font-medium hover:underline">
              View inbox →
            </Link>
          </div>
        </div>
      </div>

      {/* Activity Log and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity Log</h2>
          {activityLogs.length === 0 ? (
            <p className="text-sm text-slate-500 italic py-4">
              No activity recorded yet. Edits and creations will show up here.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {activityLogs.map(log => (
                <li key={log.id} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-semibold text-slate-800">{log.action}</span>
                    {log.details && (
                      <span className="text-slate-600 ml-2">— {log.details}</span>
                    )}
                    <span className="block text-xs text-slate-400 mt-0.5">
                      by {log.user?.name ?? 'Admin'}
                    </span>
                  </div>
                  <time className="text-xs text-slate-400">
                    {new Date(log.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    · {new Date(log.createdAt).toLocaleDateString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick Management Links */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
          <div className="flex flex-col space-y-2">
            <Link
              href="/events"
              className="p-3 rounded-md border border-slate-200 hover:border-red-400 hover:bg-red-50/50 transition-colors flex items-center justify-between text-sm font-medium text-slate-800"
            >
              <span>+ Add New Event</span>
              <span className="text-slate-400">→</span>
            </Link>
            <Link
              href="/achievements"
              className="p-3 rounded-md border border-slate-200 hover:border-red-400 hover:bg-red-50/50 transition-colors flex items-center justify-between text-sm font-medium text-slate-800"
            >
              <span>+ Add New Achievement</span>
              <span className="text-slate-400">→</span>
            </Link>
            <Link
              href="/messages"
              className="p-3 rounded-md border border-slate-200 hover:border-red-400 hover:bg-red-50/50 transition-colors flex items-center justify-between text-sm font-medium text-slate-800"
            >
              <span>View Messages ({unreadMessages})</span>
              <span className="text-slate-400">→</span>
            </Link>
            <Link
              href="/branding"
              className="p-3 rounded-md border border-slate-200 hover:border-red-400 hover:bg-red-50/50 transition-colors flex items-center justify-between text-sm font-medium text-slate-800"
            >
              <span>Update Logo & Brand Colors</span>
              <span className="text-slate-400">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
