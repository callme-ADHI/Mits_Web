import { prisma } from './db'

export async function removeOrganizationRecord(slug: string): Promise<boolean> {
  const org = await prisma.organization.findUnique({ where: { slug } })
  if (!org) return false

  await prisma.$transaction(async (tx) => {
    await tx.activityLog.deleteMany({ where: { organizationId: org.id } })
    await tx.contactMessage.deleteMany({ where: { organizationId: org.id } })
    await tx.achievement.deleteMany({ where: { organizationId: org.id } })
    await tx.event.deleteMany({ where: { organizationId: org.id } })
    await tx.user.deleteMany({ where: { organizationId: org.id } })
    await tx.organization.delete({ where: { id: org.id } })
  })

  return true
}
