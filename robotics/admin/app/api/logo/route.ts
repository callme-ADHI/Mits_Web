import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activityLog'
import { requireSession } from '@/lib/session'
import { ORG_ID } from '@/lib/env'
import { unauthorized, handleDbError } from '@/lib/http'

// 512 KB
const MAX_SIZE = 512 * 1024

function detectMimeType(buf: Buffer): string | null {
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 && buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a) {
    return 'image/png'
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return 'image/jpeg'
  }
  // WebP: RIFF ... WEBP
  if (buf.length >= 12 && buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') {
    return 'image/webp'
  }
  return null
}

export async function GET() {
  const session = await requireSession()
  if (!session) return unauthorized()

  try {
    const org = await prisma.organization.findUnique({
      where: { id: ORG_ID },
      select: { logoData: true, logoMime: true, logoUpdatedAt: true },
    })

    if (!org || !org.logoData || !org.logoMime) {
      return NextResponse.json({ error: 'No custom logo set' }, { status: 404 })
    }

    return new NextResponse(new Uint8Array(org.logoData), {
      status: 200,
      headers: {
        'Content-Type': org.logoMime,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    return handleDbError(err)
  }
}

export async function POST(req: Request) {
  const session = await requireSession()
  if (!session) return unauthorized()

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || typeof file === 'string' || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'A file is required' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File size exceeds 512 KB limit' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const detectedMime = detectMimeType(buffer)
  if (!detectedMime) {
    return NextResponse.json(
      { error: 'Invalid file format. Only PNG, JPEG, and WebP images are allowed.' },
      { status: 400 }
    )
  }

  // Also check claimed MIME type
  const claimedType = file.type.toLowerCase()
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  if (!allowedTypes.includes(claimedType)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only PNG, JPEG, and WebP images are allowed.' },
      { status: 400 }
    )
  }

  try {
    const now = new Date()
    await prisma.organization.update({
      where: { id: ORG_ID },
      data: {
        logoData: buffer,
        logoMime: detectedMime,
        logoUpdatedAt: now,
      },
    })

    await logActivity(ORG_ID, session.userId, 'organization.logo_updated', 'Uploaded new custom logo')

    return NextResponse.json({
      success: true,
      logoUpdatedAt: now.toISOString(),
      mime: detectedMime,
    })
  } catch (err) {
    return handleDbError(err)
  }
}

export async function DELETE() {
  const session = await requireSession()
  if (!session) return unauthorized()

  try {
    await prisma.organization.update({
      where: { id: ORG_ID },
      data: {
        logoData: null,
        logoMime: null,
        logoUpdatedAt: null,
      },
    })

    await logActivity(ORG_ID, session.userId, 'organization.logo_reset', 'Reset logo to default')

    return NextResponse.json({ success: true })
  } catch (err) {
    return handleDbError(err)
  }
}
