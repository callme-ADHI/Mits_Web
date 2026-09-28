import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/session'
import { ORG_ID } from '@/lib/env'
import { unauthorized, handleDbError } from '@/lib/http'

export async function GET() {
  const session = await requireSession()
  if (!session) return unauthorized()

  try {
    const messages = await prisma.contactMessage.findMany({
      where: { organizationId: ORG_ID },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(messages)
  } catch (err) {
    return handleDbError(err)
  }
}
