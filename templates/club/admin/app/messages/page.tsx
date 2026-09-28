import { prisma } from '@/lib/prisma'
import { ORG_ID } from '@/lib/env'
import MessagesManager from '@/components/MessagesManager'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    where: { organizationId: ORG_ID },
    orderBy: { createdAt: 'desc' },
  })

  return <MessagesManager initialMessages={messages} />
}
