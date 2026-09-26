import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('changeme123', 10)
  const existing = await prisma.superAdmin.findUnique({
    where: { email: 'principal@mits.test' },
  })
  if (existing) {
    await prisma.superAdmin.update({
      where: { email: 'principal@mits.test' },
      data: { name: 'Principal', passwordHash },
    })
    console.log('Updated existing superadmin principal@mits.test')
  } else {
    await prisma.superAdmin.create({
      data: { name: 'Principal', email: 'principal@mits.test', passwordHash },
    })
    console.log('Created superadmin principal@mits.test')
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
