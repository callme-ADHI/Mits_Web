import { ensureDatabaseConnection, prisma } from '../lib/db'

export async function doctorCommand() {
  console.log('Checking MITS environment...\n')

  await ensureDatabaseConnection()
  console.log('✓ Database connection OK')

  const orgCount = await prisma.organization.count()
  console.log(`✓ Found ${orgCount} organization(s) in the shared database`)

  const url = process.env.DATABASE_URL ?? ''
  const dbName = url.match(/\/([^/?]+)(\?|$)/)?.[1] ?? 'unknown'
  console.log(`✓ Database name: ${dbName}`)

  await prisma.$disconnect()
  console.log('\nAll checks passed.')
}
