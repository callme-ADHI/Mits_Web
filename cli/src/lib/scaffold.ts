import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'

export async function scaffoldProject(opts: {
  targetDir: string
  organizationId: string
  databaseUrl: string
}) {
  const templateDir = path.join(__dirname, '../../../templates/club')

  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template directory not found at: ${templateDir}`)
  }

  // Copy template -> targetDir (exclude node_modules, .next, .env, tsbuildinfo)
  await fsPromises.cp(templateDir, opts.targetDir, {
    recursive: true,
    filter: (src) => {
      const rel = path.relative(templateDir, src)
      if (rel.match(/(^|[/\\])node_modules([/\\]|$)/)) return false
      if (rel.match(/(^|[/\\])\.next([/\\]|$)/)) return false
      if (rel.match(/(^|[/\\])\.env.*([/\\]|$)/)) return false
      if (rel.endsWith('.tsbuildinfo')) return false
      return true
    },
  })

  const jwtSecret = randomBytes(32).toString('hex')
  const envContents = `DATABASE_URL="${opts.databaseUrl}"\nORGANIZATION_ID="${opts.organizationId}"\n`

  await fsPromises.mkdir(path.join(opts.targetDir, 'client'), { recursive: true })
  await fsPromises.mkdir(path.join(opts.targetDir, 'admin'), { recursive: true })

  await fsPromises.writeFile(path.join(opts.targetDir, 'client', '.env'), envContents)
  await fsPromises.writeFile(
    path.join(opts.targetDir, 'admin', '.env'),
    `${envContents}JWT_SECRET="${jwtSecret}"\n`
  )

  // Root package.json for convenience and monorepo structure
  const slug = path.basename(opts.targetDir)
  const rootPackageJson = {
    name: `mits-${slug}`,
    version: '1.0.0',
    description: `MITS generated project for ${slug}`,
    private: true,
    scripts: {
      "dev": "concurrently \"npm --prefix client run dev\" \"npm --prefix admin run dev\"",
      "dev:client": "npm --prefix client run dev",
      "dev:admin": "npm --prefix admin run dev",
      "build": "npm --prefix client run build && npm --prefix admin run build",
      "build:client": "npm --prefix client run build",
      "build:admin": "npm --prefix admin run build",
      "typecheck": "npm --prefix client run typecheck && npm --prefix admin run typecheck",
      "lint": "npm --prefix client run lint && npm --prefix admin run lint"
    },
    devDependencies: {
      "concurrently": "^9.1.2"
    }
  }
  await fsPromises.writeFile(
    path.join(opts.targetDir, 'package.json'),
    JSON.stringify(rootPackageJson, null, 2) + '\n'
  )
}
