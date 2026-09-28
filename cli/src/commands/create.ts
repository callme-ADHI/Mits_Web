import readline from 'node:readline'
import path from 'path'
import { ensureDatabaseConnection, prisma } from '../lib/db'
import { createOrganizationRecord } from '../lib/createOrganization'
import { scaffoldProject } from '../lib/scaffold'

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/

export async function createCommand(type: string, name: string) {
  if (type !== 'club' && type !== 'department') {
    console.error(`✗ Invalid type "${type}". Must be "club" or "department".`)
    process.exit(1)
  }

  if (!name || !name.trim()) {
    console.error(`✗ Please specify a name for the organization.`)
    process.exit(1)
  }

  await ensureDatabaseConnection()

  const slug = name.toLowerCase().replace(/\s+/g, '-')

  const existing = await prisma.organization.findUnique({ where: { slug } })
  if (existing) {
    console.error(`✗ An organization with slug "${slug}" already exists.`)
    await prisma.$disconnect()
    process.exit(1)
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: process.stdin.isTTY ?? false,
  })

  const lineIterator = rl[Symbol.asyncIterator]()

  async function ask(promptText: string): Promise<string> {
    process.stdout.write(promptText)
    const res = await lineIterator.next()
    if (res.done) return ''
    return String(res.value).trim()
  }

  let adminEmail = ''
  let primaryColor = '#E10600'
  let secondaryColor = '#141414'

  try {
    while (!adminEmail.includes('@')) {
      adminEmail = await ask("Admin's email: ")
      if (!adminEmail.includes('@')) {
        console.log('  Please enter a valid email address')
      }
    }

    const pColorInput = await ask('Primary color (hex) [#E10600]: ')
    if (pColorInput) {
      if (HEX_COLOR_RE.test(pColorInput)) {
        primaryColor = pColorInput
      } else {
        console.log(`  Invalid hex format "${pColorInput}". Falling back to default #E10600.`)
      }
    }

    const sColorInput = await ask('Secondary color (hex) [#141414]: ')
    if (sColorInput) {
      if (HEX_COLOR_RE.test(sColorInput)) {
        secondaryColor = sColorInput
      } else {
        console.log(`  Invalid hex format "${sColorInput}". Falling back to default #141414.`)
      }
    }
  } finally {
    rl.close()
  }

  console.log('\nCreating organization record...')
  const { organizationId, tempPassword } = await createOrganizationRecord({
    name,
    slug,
    type: type as 'club' | 'department',
    primaryColor,
    secondaryColor,
    adminEmail,
  })

  console.log('Scaffolding project files...')
  const targetDir = path.join(process.cwd(), slug)
  await scaffoldProject({
    targetDir,
    organizationId,
    databaseUrl: process.env.DATABASE_URL!,
  })

  await prisma.$disconnect()

  console.log(`
✓ ${name} created at ./${slug}

  Admin login:
    email:    ${adminEmail.trim().toLowerCase()}
    password: ${tempPassword}   (save this now — it will not be shown again)

  Next steps:
    cd ${slug}/client && npm install && npx prisma generate && npm run dev
    cd ${slug}/admin  && npm install && npx prisma generate && npm run dev
`)
}
