#!/usr/bin/env node
import { createCommand } from './commands/create'
import { listCommand } from './commands/list'
import { doctorCommand } from './commands/doctor'

const args = process.argv.slice(2)
const command = args[0]

function printHelp() {
  console.log(`
Usage: mits <command> [options]

MITS Web — Generate and manage college club/department websites

Commands:
  doctor                     Check that MITS is set up correctly (DB connection, schema)
  list                       List all organizations in the shared database
  create <type> <name>       Generate a new club or department website from the template

Options:
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
    case 'create': {
      const type = args[1]
      const name = args.slice(2).join(' ')
      if (!type || !name) {
        console.error('✗ Usage: mits create <club|department> <name>')
        process.exit(1)
      }
      await createCommand(type, name)
      break
    }
    default:
      console.error(`✗ Unknown command "${command}". Run "mits --help" for a list of available commands.`)
      process.exit(1)
  }
}

main().catch((err) => {
  console.error(`✗ Error: ${err.message || err}`)
  process.exit(1)
})
