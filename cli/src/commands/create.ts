import fs from 'fs'
import path from 'path'
import readline from 'node:readline'
import { ensureDatabaseConnection, prisma } from '../lib/db'
import { createOrganizationRecord } from '../lib/createOrganization'
import { scaffoldProject } from '../lib/scaffold'
import { removeOrganizationRecord } from '../lib/removeOrganization'
import { CliError } from '../lib/errors'
import { askUntilValid } from '../lib/prompt'

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface CreateFlags {
  email?: string
  primary?: string
  secondary?: string
  install?: boolean
}

function sanitizeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function createCommand(type: string, name: string, flags: CreateFlags = {}) {
  // Validate type
  if (type !== 'club' && type !== 'department') {
    throw new CliError(`Invalid type "${type}". Must be "club" or "department".`)
  }

  // Validate name
  const trimmedName = (name ?? '').trim()
  if (trimmedName.length < 2 || trimmedName.length > 60) {
    throw new CliError('Organization name must be between 2 and 60 characters.')
  }

  // Compute and validate slug
  const slug = sanitizeSlug(trimmedName)
  if (!slug) {
    throw new CliError('Organization name must contain at least one alphanumeric character to form a valid slug.')
  }

  // Target directory check
  const targetDir = path.join(process.cwd(), slug)
  if (fs.existsSync(targetDir)) {
    throw new CliError(`Target folder "./${slug}" already exists. Remove it or choose a different name.`)
  }

  await ensureDatabaseConnection()

  // Slug collision check
  const existingOrg = await prisma.organization.findUnique({ where: { slug } })
  if (existingOrg) {
    await prisma.$disconnect()
    throw new CliError(`An organization with slug "${slug}" already exists.`)
  }

  let adminEmail = ''
  let primaryColor = '#E10600'
  let secondaryColor = '#141414'

  let rl: readline.Interface | null = null
  let lineIterator: AsyncIterableIterator<string> | null = null

  function getLineIterator(): AsyncIterableIterator<string> {
    if (!rl) {
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: process.stdin.isTTY ?? false,
      })
      lineIterator = rl[Symbol.asyncIterator]()
    }
    return lineIterator!
  }

  async function ask(promptText: string): Promise<string | null> {
    const it = getLineIterator()
    process.stdout.write(promptText)
    const res = await it.next()
    if (res.done) return null
    return String(res.value)
  }

  try {
    // 1. Email
    if (flags.email) {
      const em = flags.email.trim().toLowerCase()
      if (!EMAIL_RE.test(em)) {
        throw new CliError(`Invalid email address passed via flag: "${flags.email}"`)
      }
      adminEmail = em
    } else {
      adminEmail = await askUntilValid(
        ask,
        "Admin's email: ",
        (val) => {
          const v = val.toLowerCase()
          return EMAIL_RE.test(v) ? null : 'Please enter a valid email address'
        }
      )
      adminEmail = adminEmail.toLowerCase()
    }

    // Check duplicate admin email globally
    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } })
    if (existingUser) {
      throw new CliError(`A user with email "${adminEmail}" already exists. Each admin email must be globally unique.`)
    }

    // 2. Primary color
    if (flags.primary) {
      if (!HEX_COLOR_RE.test(flags.primary)) {
        throw new CliError(`Invalid primary color format "${flags.primary}". Expected a 6-digit hex color like #E10600.`)
      }
      primaryColor = flags.primary
    } else {
      const ans = await askUntilValid(
        ask,
        'Primary color (hex) [#E10600]: ',
        (val) => {
          if (!val) return null // default
          return HEX_COLOR_RE.test(val) ? null : 'Please enter a valid 6-digit hex color like #E10600'
        }
      )
      if (ans) primaryColor = ans
    }

    // 3. Secondary color
    if (flags.secondary) {
      if (!HEX_COLOR_RE.test(flags.secondary)) {
        throw new CliError(`Invalid secondary color format "${flags.secondary}". Expected a 6-digit hex color like #141414.`)
      }
      secondaryColor = flags.secondary
    } else {
      const ans = await askUntilValid(
        ask,
        'Secondary color (hex) [#141414]: ',
        (val) => {
          if (!val) return null // default
          return HEX_COLOR_RE.test(val) ? null : 'Please enter a valid 6-digit hex color like #141414'
        }
      )
      if (ans) secondaryColor = ans
    }
  } finally {
    if (rl) {
      (rl as readline.Interface).close()
      process.stdin.pause()
    }
  }

  console.log('\nCreating organization record...')
  const { organizationId, tempPassword } = await createOrganizationRecord({
    name: trimmedName,
    slug,
    type: type as 'club' | 'department',
    primaryColor,
    secondaryColor,
    adminEmail,
  })

  try {
    console.log('Scaffolding project files...')
    await scaffoldProject({
      targetDir,
      organizationId,
      databaseUrl: process.env.DATABASE_URL!,
      install: flags.install !== false,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error(`\n✗ Error during scaffolding or dependency installation: ${errorMsg}`)
    console.log('Rolling back organization record and removing created files...')
    try {
      await removeOrganizationRecord(slug)
      if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true })
      }
      console.log('✓ Rollback completed successfully. No orphan records left.')
    } catch (rbErr) {
      console.error('✗ Rollback encountered an error:', rbErr)
    }
    await prisma.$disconnect()
    process.exit(1)
  }

  await prisma.$disconnect()

  console.log(`
✓ ${trimmedName} created at ./${slug}

  Admin login:
    email:    ${adminEmail}
    password: ${tempPassword}   (save this now — it will not be shown again)

  Next step:
    cd ${slug} && npm run dev
`)
}
