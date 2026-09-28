import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { prisma } from './db'

export async function createOrganizationRecord(opts: {
  name: string
  slug: string
  type: 'club' | 'department'
  primaryColor: string
  secondaryColor: string
  adminEmail: string
}) {
  const org = await prisma.organization.create({
    data: {
      name: opts.name,
      slug: opts.slug,
      type: opts.type,
      primaryColor: opts.primaryColor,
      secondaryColor: opts.secondaryColor,
    },
  })

  const tempPassword = randomBytes(6).toString('hex')
  const passwordHash = await bcrypt.hash(tempPassword, 10)

  await prisma.user.create({
    data: {
      name: `${opts.name} Admin`,
      email: opts.adminEmail,
      passwordHash,
      organizationId: org.id,
    },
  })

  return { organizationId: org.id, tempPassword }
}
