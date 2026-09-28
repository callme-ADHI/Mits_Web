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
  const tempPassword = randomBytes(6).toString('hex')
  const passwordHash = await bcrypt.hash(tempPassword, 10)
  const normalizedEmail = opts.adminEmail.trim().toLowerCase()

  const org = await prisma.$transaction(async (tx) => {
    const created = await tx.organization.create({
      data: {
        name: opts.name,
        slug: opts.slug,
        type: opts.type,
        primaryColor: opts.primaryColor,
        secondaryColor: opts.secondaryColor,
      },
    })
    await tx.user.create({
      data: {
        name: `${opts.name} Admin`,
        email: normalizedEmail,
        passwordHash,
        organizationId: created.id,
      },
    })
    return created
  })

  return { organizationId: org.id, tempPassword }
}
