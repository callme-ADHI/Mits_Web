import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activityLog'
import { getSessionUserId } from '@/lib/auth'

const ORG_ID = process.env.ORGANIZATION_ID!

export async function GET() {
  const events = await prisma.event.findMany({
    where: { organizationId: ORG_ID },
    orderBy: { eventDate: 'asc' },
  })
  return NextResponse.json(events)
}

export async function POST(req: Request) {
  const userId = await getSessionUserId()
  const body = await req.json()
  const { title, description, eventDate, status, imageUrl } = body

  const event = await prisma.event.create({
    data: {
      organizationId: ORG_ID,
      title,
      description,
      eventDate: new Date(eventDate),
      status: status || 'upcoming',
      imageUrl: imageUrl || null,
    },
  })

  await logActivity(ORG_ID, userId, 'event.created', title)
  return NextResponse.json(event, { status: 201 })
}
