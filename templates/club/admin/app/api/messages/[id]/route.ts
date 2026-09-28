import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activityLog'
import { requireSession } from '@/lib/session'
import { ORG_ID } from '@/lib/env'
import { readJson, unauthorized, handleDbError } from '@/lib/http'

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await requireSession()
  if (!session) return unauthorized()

  const { id } = await ctx.params
  const body = await readJson(req)
  if (!body.ok) return body.response

  const isRead = typeof body.data?.isRead === 'boolean' ? body.data.isRead : true

  try {
    const message = await prisma.contactMessage.update({
      where: { id, organizationId: ORG_ID },
      data: { isRead },
    })
    return NextResponse.json(message)
  } catch (err) {
    return handleDbError(err)
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await requireSession()
  if (!session) return unauthorized()

  const { id } = await ctx.params

  try {
    const message = await prisma.contactMessage.delete({
      where: { id, organizationId: ORG_ID },
    })
    await logActivity(ORG_ID, session.userId, 'message.deleted', `Deleted message from ${message.name}`)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return handleDbError(err)
  }
}
