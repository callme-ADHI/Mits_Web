import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activityLog'
import { requireSession } from '@/lib/session'
import { ORG_ID } from '@/lib/env'
import { readJson, validationError, unauthorized, handleDbError } from '@/lib/http'
import { achievementUpdateSchema } from '@/lib/validation'

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await requireSession()
  if (!session) return unauthorized()

  const { id } = await ctx.params

  const body = await readJson(req)
  if (!body.ok) return body.response

  const parsed = achievementUpdateSchema.safeParse(body.data)
  if (!parsed.success) return validationError(parsed.error)

  try {
    const updated = await prisma.achievement.update({
      where: { id, organizationId: ORG_ID }, // ownership enforced in query
      data: parsed.data,
    })
    await logActivity(ORG_ID, session.userId, 'achievement.updated', updated.title)
    return NextResponse.json(updated)
  } catch (err) {
    return handleDbError(err) // P2025 → 404
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
    const removed = await prisma.achievement.delete({
      where: { id, organizationId: ORG_ID },
    })
    await logActivity(ORG_ID, session.userId, 'achievement.deleted', removed.title)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return handleDbError(err)
  }
}
