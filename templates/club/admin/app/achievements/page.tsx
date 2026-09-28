import { prisma } from '@/lib/prisma'
import AchievementsManager from '@/components/AchievementsManager'

export const dynamic = 'force-dynamic'

export default async function AdminAchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    where: { organizationId: process.env.ORGANIZATION_ID },
    orderBy: { achievementDate: 'desc' },
  })

  return <AchievementsManager initialAchievements={achievements} />
}
