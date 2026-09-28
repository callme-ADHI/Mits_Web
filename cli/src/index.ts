#!/usr/bin/env node
import { createCommand, type CreateFlags } from './commands/create'
import { listCommand } from './commands/list'
import { doctorCommand } from './commands/doctor'
import { removeCommand } from './commands/remove'
import { CliError } from './lib/errors'

const rawArgs = process.argv.slice(2)
const command = rawArgs[0]

function printHelp() {
  console.log(`
Usage: mits <command> [options]

MITS Web — Generate and manage college club/department websites

Commands:
  doctor                     Check that MITS is set up correctly (DB connection, schema, Node)
  list                       List all organizations in the shared database
  create <type> <name>       Generate a new club or department website from the template
  remove <slug>              Permanently delete an organization and all its data from DB

Options for 'create':
  --email <email>            Admin user email (skips prompt)
  --primary <hex>            Primary brand color in #RRGGBB format (skips prompt)
  --secondary <hex>          Secondary brand color in #RRGGBB format (skips prompt)
  --no-install               Skip automatic npm install in generated folders

Options for 'remove':
  --yes                      Skip interactive deletion confirmation prompt

General Options:
  -v, --version              Output the version number
  -h, --help                 Display help for command
`)
}

async function main() {
  if (!command || command === '--help' || command === '-h' || command === 'help') {
    printHelp()
    process.exit(0)
  }

  if (command === '--version' || command === '-v' || command === 'version') {
    console.log('1.0.0')
    process.exit(0)
  }

  switch (command) {
    case 'doctor':
      await doctorCommand()
      break
    case 'list':
      await listCommand()
      break
    case 'remove': {
      const slug = rawArgs[1]
      const yes = rawArgs.includes('--yes')
      await removeCommand(slug, { yes })
      break
    }
    case 'create': {
      const type = rawArgs[1]
      const flags: CreateFlags = {}
      const nameParts: string[] = []

      for (let i = 2; i < rawArgs.length; i++) {
        const arg = rawArgs[i]
        if (arg === '--email' && i + 1 < rawArgs.length) {
          flags.email = rawArgs[++i]
        } else if (arg === '--primary' && i + 1 < rawArgs.length) {
          flags.primary = rawArgs[++i]
        } else if (arg === '--secondary' && i + 1 < rawArgs.length) {
          flags.secondary = rawArgs[++i]
        } else if (arg === '--no-install') {
          flags.install = false
        } else if (arg.startsWith('--')) {
          throw new CliError(`Unknown option "${arg}"`)
        } else {
          nameParts.push(arg)
        }
      }

      const name = nameParts.join(' ')
      if (!type || !name) {
        console.error('✗ Usage: mits create <club|department> <name> [options]')
        process.exit(1)
      }
      await createCommand(type, name, flags)
      break
    }
    default:
      console.error(`✗ Unknown command "${command}". Run "mits --help" for a list of available commands.`)
      process.exit(1)
  }
  process.exit(0)
}

main().catch((err) => {
  if (err instanceof CliError) {
    console.error(`✗ ${err.message}`)
  } else {
    console.error(`✗ Error: ${err.message || err}`)
  }
  process.exit(1)
})
