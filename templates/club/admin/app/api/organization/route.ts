import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activityLog'
import { requireSession } from '@/lib/session'
import { ORG_ID } from '@/lib/env'
import { readJson, validationError, unauthorized, handleDbError } from '@/lib/http'
import { organizationUpdateSchema } from '@/lib/validation'

export async function GET() {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: ORG_ID },
    })
    return NextResponse.json(org)
  } catch (err) {
    return handleDbError(err)
  }
}

export async function PUT(req: Request) {
  const session = await requireSession()
  if (!session) return unauthorized()

  const body = await readJson(req)
  if (!body.ok) return body.response

  const parsed = organizationUpdateSchema.safeParse(body.data)
  if (!parsed.success) return validationError(parsed.error)

  try {
    const org = await prisma.organization.update({
      where: { id: ORG_ID },
      data: parsed.data,
    })
    await logActivity(ORG_ID, session.userId, 'organization.updated')
    return NextResponse.json(org)
  } catch (err) {
    return handleDbError(err)
  }
}
