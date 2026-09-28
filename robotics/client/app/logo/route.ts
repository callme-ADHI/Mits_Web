import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ORG_ID } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: ORG_ID },
      select: { logoData: true, logoMime: true },
    })

    if (org?.logoData && org?.logoMime) {
      return new NextResponse(new Uint8Array(org.logoData), {
        status: 200,
        headers: {
          'Content-Type': org.logoMime,
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'public, max-age=60',
        },
      })
    }
  } catch (err) {
    console.error('Error fetching logo:', err)
  }

  return NextResponse.redirect(new URL('/default-logo.svg', req.url))
}
