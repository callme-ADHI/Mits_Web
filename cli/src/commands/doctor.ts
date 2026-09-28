import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { ensureDatabaseConnection, prisma } from '../lib/db'

function md5(filePath: string): string {
  const content = fs.readFileSync(filePath)
  return crypto.createHash('md5').update(content).digest('hex')
}

export async function doctorCommand() {
  console.log('Checking MITS environment...\n')

  // 1. Node version check (v18+)
  const nodeVer = process.version
  const major = parseInt(nodeVer.replace(/^v/, '').split('.')[0], 10)
  if (major < 18) {
    console.error(`✗ Node.js version ${nodeVer} is unsupported. Please use Node.js 18 or newer.`)
    process.exit(1)
  }
  console.log(`✓ Node.js version OK (${nodeVer})`)

  // 2. Template folder check
  const templateDir = process.env.MITS_TEMPLATE_DIR || path.join(__dirname, '../../../templates/club')
  if (!fs.existsSync(templateDir)) {
    console.error(`✗ Template directory not found at: ${templateDir}`)
    process.exit(1)
  }
  console.log('✓ Template directory exists')

  // 3. Schema synchronization check across all known schemas
  const rootDir = path.join(__dirname, '../../..')
  const schemaCandidates = [
    path.join(rootDir, 'database/schema.prisma'),
    path.join(rootDir, 'robotics/database/schema.prisma'),
    path.join(rootDir, 'templates/club/database/schema.prisma'),
    path.join(rootDir, 'templates/club/client/prisma/schema.prisma'),
    path.join(rootDir, 'templates/club/admin/prisma/schema.prisma'),
  ]

  const existingSchemas = schemaCandidates.filter((p) => fs.existsSync(p))
  if (existingSchemas.length > 0) {
    const hashes = new Set(existingSchemas.map(md5))
    if (hashes.size > 1) {
      console.error('✗ Schema drift detected across schema.prisma files!')
      process.exit(1)
    }
    console.log(`✓ Schema synchronization OK (${existingSchemas.length} files matching)`)
  }

  // 4. Database connection & org count
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
