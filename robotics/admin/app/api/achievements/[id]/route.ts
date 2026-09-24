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
  if (body.achievementDate) {
    dataToUpdate.achievementDate = new Date(body.achievementDate)
  }

  const achievement = await prisma.achievement.update({
    where: { id },
    data: dataToUpdate,
  })

  await logActivity(ORG_ID, userId, 'achievement.updated', achievement.title)
  return NextResponse.json(achievement)
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(props.params)
  const userId = await getSessionUserId()

  const achievement = await prisma.achievement.delete({
    where: { id },
  })

  await logActivity(ORG_ID, userId, 'achievement.deleted', achievement.title)
  return new NextResponse(null, { status: 204 })
}
