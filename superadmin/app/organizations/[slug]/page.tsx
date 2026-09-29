import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { describeAction } from '@/lib/formatActivity'
import { OrgDetailView } from '@/components/OrgDetailView'

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

  const serializedOrg = {
    id: org.id,
    name: org.name,
    slug: org.slug,
    type: org.type,
    description: org.description,
    primaryColor: org.primaryColor,
    secondaryColor: org.secondaryColor,
    contactEmail: org.contactEmail,
    events: org.events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      eventDate: e.eventDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: e.status,
    })),
    achievements: org.achievements.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      achievementDate: a.achievementDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    })),
    activityLogs: org.activityLogs.map((log) => ({
      id: log.id,
      action: log.action,
      description: describeAction(log.action, log.details),
      userName: log.user?.name ?? 'System Administrator',
      createdAt: log.createdAt.toISOString(),
    })),
  }

  return <OrgDetailView org={serializedOrg} />
}
