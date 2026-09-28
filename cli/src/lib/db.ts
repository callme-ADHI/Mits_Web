import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

// Load cli/.env — the ONE place DATABASE_URL lives for all commands
const envPath = path.join(__dirname, '../../.env')
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim()
      let val = trimmed.slice(idx + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      process.env[key] = val
    }
  }
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

export async function ensureDatabaseConnection() {
  try {
    await prisma.$connect()
  } catch {
    console.error(`
✗ Could not connect to the database.

  DATABASE_URL: ${process.env.DATABASE_URL ? 'found in cli/.env' : 'MISSING — not set in cli/.env'}

  Check:
    1. Is PostgreSQL running?  →  pg_isready
    2. Does cli/.env exist with a DATABASE_URL matching database/.env exactly?
    3. Is the database name, user, and password correct?
`)
    process.exit(1)
  }
}
