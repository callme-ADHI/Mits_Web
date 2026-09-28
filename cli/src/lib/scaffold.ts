import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'
import { spawn } from 'child_process'

function runNpmInstall(cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['install'], {
      cwd,
      stdio: 'inherit',
      env: process.env,
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`npm install exited with code ${code} in ${cwd}`))
    })
  })
}

export async function scaffoldProject(opts: {
  targetDir: string
  organizationId: string
  databaseUrl: string
  install?: boolean
}) {
  const templateDir = process.env.MITS_TEMPLATE_DIR || path.join(__dirname, '../../../templates/club')

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

  const slug = path.basename(opts.targetDir)

  // Root package.json
  const rootPackageJson = {
    name: `mits-${slug}`,
    version: '1.0.0',
    description: `MITS generated project for ${slug}`,
    private: true,
    scripts: {
      "dev": "concurrently \"npm --prefix client run dev -- -p ${MITS_CLIENT_PORT:-3000}\" \"npm --prefix admin run dev -- -p ${MITS_ADMIN_PORT:-3001}\"",
      "dev:client": "npm --prefix client run dev -- -p ${MITS_CLIENT_PORT:-3000}",
      "dev:admin": "npm --prefix admin run dev -- -p ${MITS_ADMIN_PORT:-3001}",
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

  // Root README.md
  const readmeContent = `# MITS — ${slug}

This project was generated using the \`mits\` CLI for **${slug}**.

## Getting Started

To run both client and admin applications concurrently:

\`\`\`bash
npm run dev
\`\`\`

By default:
- **Public Website (Client):** http://localhost:3000
- **Admin Portal:** http://localhost:3001

You can override the default ports by setting environment variables:
\`\`\`bash
MITS_CLIENT_PORT=3005 MITS_ADMIN_PORT=3006 npm run dev
\`\`\`

## Commands

- \`npm run dev\`: Start both client and admin in dev mode
- \`npm run build\`: Build both applications for production
- \`npm run typecheck\`: Run TypeScript type checking
- \`npm run lint\`: Run ESLint across apps

## Security Note

- The temporary admin password was printed once in your terminal during creation.
- **Do not edit the generated \`.env\` files by hand.** They contain managed credentials for the shared platform.
`

  await fsPromises.writeFile(path.join(opts.targetDir, 'README.md'), readmeContent)

  // Real npm install unless opted out
  if (opts.install !== false) {
    console.log('Installing dependencies in client/ (including prisma generate)...')
    await runNpmInstall(path.join(opts.targetDir, 'client'))

    console.log('Installing dependencies in admin/ (including prisma generate)...')
    await runNpmInstall(path.join(opts.targetDir, 'admin'))

    console.log('Installing root devDependencies (concurrently)...')
    await runNpmInstall(opts.targetDir)
  }
}
