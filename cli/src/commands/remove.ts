import readline from 'node:readline'
import { ensureDatabaseConnection, prisma } from '../lib/db'
import { removeOrganizationRecord } from '../lib/removeOrganization'
import { CliError } from '../lib/errors'

export async function removeCommand(slug: string, options: { yes?: boolean }) {
  if (!slug || !slug.trim()) {
    throw new CliError('Please specify the slug of the organization to remove.')
  }

  await ensureDatabaseConnection()

  const org = await prisma.organization.findUnique({ where: { slug } })
  if (!org) {
    await prisma.$disconnect()
    throw new CliError(`Organization with slug "${slug}" does not exist.`)
  }

  if (!options.yes) {
    if (!process.stdin.isTTY) {
      await prisma.$disconnect()
      throw new CliError('Cannot confirm deletion without a TTY. Use --yes to skip confirmation.')
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const answer = await new Promise<string>((resolve) => {
      rl.question(`Are you sure you want to permanently delete organization "${org.name}" (${slug})? Type the slug to confirm: `, (ans) => {
        rl.close()
        process.stdin.pause()
        resolve(ans.trim())
      })
    })

    if (answer !== slug) {
      await prisma.$disconnect()
      throw new CliError(`Confirmation did not match slug "${slug}". Aborted.`)
    }
  }

  console.log(`Removing organization "${org.name}" and all associated data...`)
  await removeOrganizationRecord(slug)
  await prisma.$disconnect()

  console.log(`✓ Organization "${slug}" has been removed from the database.`)
  console.log(`Note: Project files were not deleted. Remember to remove the project folder yourself if needed: rm -rf ./${slug}`)
}
