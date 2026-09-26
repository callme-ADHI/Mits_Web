import { prisma } from '@/lib/prisma'

export default async function DirectoryPage() {
  const organizations = await prisma.organization.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      activityLogs: { orderBy: { createdAt: 'desc' }, take: 1 },
      _count: { select: { events: true, achievements: true } },
    },
  })

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Organizations</h1>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Type</th>
              <th className="py-3 px-6">Events</th>
              <th className="py-3 px-6">Last activity</th>
              <th className="py-3 px-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {organizations.map((org) => (
              <tr key={org.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">{org.name}</td>
                <td className="py-4 px-6 capitalize text-slate-600">{org.type}</td>
                <td className="py-4 px-6 text-slate-600">{org._count.events}</td>
                <td className="py-4 px-6 text-slate-600">
                  {org.activityLogs[0]?.createdAt.toLocaleDateString() ?? 'No activity yet'}
                </td>
                <td className="py-4 px-6 text-right">
                  <a href={`/organizations/${org.slug}`} className="text-brand-red font-medium hover:underline">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
