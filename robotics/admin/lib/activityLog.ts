import { prisma } from './prisma'

export async function logActivity(
  organizationId: string,
  userId: string | null,
  action: string,
  details?: string
) {
  await prisma.activityLog.create({
    data: {
      organizationId,
      userId,
      action,
      details: details ? details.slice(0, 200) : null,
    },
  })
}
