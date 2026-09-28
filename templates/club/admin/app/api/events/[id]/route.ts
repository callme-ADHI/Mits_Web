import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activityLog'
import { getSessionUserId } from '@/lib/auth'

const ORG_ID = process.env.ORGANIZATION_ID!

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(props.params)
  const userId = await getSessionUserId()
  const body = await req.json()

  const dataToUpdate: Record<string, unknown> = { ...body }
  if (body.eventDate) {
    dataToUpdate.eventDate = new Date(body.eventDate)
  }

  const event = await prisma.event.update({
    where: { id },
    data: dataToUpdate,
  })

  await logActivity(ORG_ID, userId, 'event.updated', event.title)
  return NextResponse.json(event)
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(props.params)
  const userId = await getSessionUserId()

  const event = await prisma.event.delete({
    where: { id },
  })

  await logActivity(ORG_ID, userId, 'event.deleted', event.title)
  return new NextResponse(null, { status: 204 })
}
