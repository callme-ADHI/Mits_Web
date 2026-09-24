import { prisma } from '@/lib/prisma'
import EventsManager from '@/components/EventsManager'

export const dynamic = 'force-dynamic'

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    where: { organizationId: process.env.ORGANIZATION_ID },
    orderBy: { eventDate: 'desc' },
  })

  return <EventsManager initialEvents={events} />
}
