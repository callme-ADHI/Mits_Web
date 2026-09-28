import { prisma } from '@/lib/prisma'
import { ORG_ID } from '@/lib/env'
import { safeHex, darken, tintFromPrimary, readableOn } from '@/lib/color'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingContactButton from '@/components/FloatingContactButton'
import { SmoothScroll } from '@/components/SmoothScroll'
import { ScrollProgressBar } from '@/components/ScrollProgressBar'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const org = await prisma.organization.findUnique({ where: { id: ORG_ID } })
  const name = org?.name ?? 'Club Website'
  return {
    title: { default: name, template: `%s — ${name}` },
    description: org?.description ?? `Welcome to ${name}.`,
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const org = await prisma.organization.findUnique({ where: { id: ORG_ID } })

  const primary = safeHex(org?.primaryColor, '#E10600')
  const ink = safeHex(org?.secondaryColor, '#141414')
  const primaryDark = darken(primary, 0.15)
  const tint = tintFromPrimary(primary)
  const onPrimary = readableOn(primary)

  // Build CSS string from safe, validated color values only — no raw DB strings
  const cssVars = [
    `--color-red: ${primary}`,
    `--color-red-dark: ${primaryDark}`,
    `--color-ink: ${ink}`,
    `--color-paper: #FFFFFF`,
    `--color-tint: ${tint}`,
    `--color-hairline: #E7E2E1`,
    `--color-on-red: ${onPrimary}`,
    `--footer-h: 0px`,
  ].join('; ')

  return (
    <html lang="en">
      <head>
        {/* Safe: only validated hex values, never raw DB strings */}
        <style>{`:root { ${cssVars} }`}</style>
      </head>
      <body>
        <SmoothScroll />
        <ScrollProgressBar />
        <Navbar orgName={org?.name ?? 'Club Website'} />
        {/* Content wrapper with background and relative z-10 for footer reveal */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            background: 'var(--color-paper)',
            marginBottom: 'var(--footer-h)',
          }}
        >
          {children}
        </div>
        <Footer
          orgName={org?.name ?? 'Club Website'}
          contactEmail={org?.contactEmail ?? null}
        />
        <FloatingContactButton />
      </body>
    </html>
  )
}
