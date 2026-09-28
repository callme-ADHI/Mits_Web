import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activityLog'
import { requireSession } from '@/lib/session'
import { ORG_ID } from '@/lib/env'
import { readJson, validationError, unauthorized, handleDbError } from '@/lib/http'
import { achievementCreateSchema } from '@/lib/validation'

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      where: { organizationId: ORG_ID },
      orderBy: { achievementDate: 'desc' },
    })
    return NextResponse.json(achievements)
  } catch (err) {
    return handleDbError(err)
  }
}

export async function POST(req: Request) {
  const session = await requireSession()
  if (!session) return unauthorized()

  const body = await readJson(req)
  if (!body.ok) return body.response

  const parsed = achievementCreateSchema.safeParse(body.data)
  if (!parsed.success) return validationError(parsed.error)

  try {
    const achievement = await prisma.achievement.create({
      data: {
        organizationId: ORG_ID,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        achievementDate: parsed.data.achievementDate,
        imageUrl: parsed.data.imageUrl ?? null,
      },
    })
    await logActivity(ORG_ID, session.userId, 'achievement.created', achievement.title)
    return NextResponse.json(achievement, { status: 201 })
  } catch (err) {
    return handleDbError(err)
  }
}
