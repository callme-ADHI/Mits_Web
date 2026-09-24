import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activityLog'
import { getSessionUserId } from '@/lib/auth'

const ORG_ID = process.env.ORGANIZATION_ID!

export async function GET() {
  const achievements = await prisma.achievement.findMany({
    where: { organizationId: ORG_ID },
    orderBy: { achievementDate: 'desc' },
  })
  return NextResponse.json(achievements)
}

export async function POST(req: Request) {
  const userId = await getSessionUserId()
  const body = await req.json()
  const { title, description, achievementDate, imageUrl } = body

  const achievement = await prisma.achievement.create({
    data: {
      organizationId: ORG_ID,
      title,
      description,
      achievementDate: new Date(achievementDate),
      imageUrl: imageUrl || null,
    },
  })

  await logActivity(ORG_ID, userId, 'achievement.created', title)
  return NextResponse.json(achievement, { status: 201 })
}
