import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { signSession } from '@/lib/session'
import { ORG_ID } from '@/lib/env'
import { readJson } from '@/lib/http'

// A fixed dummy hash used when the user is not found, to keep timing constant
const DUMMY_HASH = '$2b$10$3PD9cJ4QfEWtJdD4PXi0/.JWUQJ9g/s/1JAx.UJFEkBIDKiMAnMla'

export async function POST(req: Request) {
  const body = await readJson(req)
  if (!body.ok) return body.response

  const email = typeof body.data?.email === 'string' ? body.data.email.trim().toLowerCase() : ''
  const password = typeof body.data?.password === 'string' ? body.data.password : ''

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
  })

  // Always run bcrypt.compare to prevent timing-based user enumeration
  const hashToCheck = user?.passwordHash ?? DUMMY_HASH
  const valid = await bcrypt.compare(password, hashToCheck)

  if (!valid || !user || user.organizationId !== ORG_ID) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = signSession(user.id)

  const response = NextResponse.json({ name: user.name })
  response.cookies.set('mits_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
  return response
}
