import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activityLog'
import { requireSession } from '@/lib/session'
import { ORG_ID } from '@/lib/env'
import { readJson, validationError, unauthorized, handleDbError } from '@/lib/http'
import { eventCreateSchema } from '@/lib/validation'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { organizationId: ORG_ID },
      orderBy: { eventDate: 'asc' },
    })
    return NextResponse.json(events)
  } catch (err) {
    return handleDbError(err)
  }
}

export async function POST(req: Request) {
  const session = await requireSession()
  if (!session) return unauthorized()

  const body = await readJson(req)
  if (!body.ok) return body.response

  const parsed = eventCreateSchema.safeParse(body.data)
  if (!parsed.success) return validationError(parsed.error)

  try {
    const event = await prisma.event.create({
      data: {
        organizationId: ORG_ID,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        eventDate: parsed.data.eventDate,
        status: parsed.data.status ?? 'upcoming',
        imageUrl: parsed.data.imageUrl ?? null,
      },
    })
    await logActivity(ORG_ID, session.userId, 'event.created', event.title)
    return NextResponse.json(event, { status: 201 })
  } catch (err) {
    return handleDbError(err)
  }
}
