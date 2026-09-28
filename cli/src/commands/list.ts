import { ensureDatabaseConnection, prisma } from '../lib/db'

export async function listCommand() {
  await ensureDatabaseConnection()

  const orgs = await prisma.organization.findMany({ orderBy: { createdAt: 'desc' } })

  if (orgs.length === 0) {
    console.log('No organizations yet. Run `mits create club <name>` to make one.')
  } else {
    console.log(`${orgs.length} organization(s):\n`)
    orgs.forEach((org) => {
      console.log(`  ${org.name}  (${org.type})  — slug: ${org.slug}`)
    })
  }

  await prisma.$disconnect()
}
