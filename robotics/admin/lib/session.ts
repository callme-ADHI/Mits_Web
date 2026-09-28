import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { ORG_ID, JWT_SECRET } from '@/lib/env'

interface SessionPayload {
  userId: string
  orgId: string
}

export function signSession(userId: string): string {
  return jwt.sign({ userId, orgId: ORG_ID }, JWT_SECRET, { expiresIn: '8h' })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('mits_session')?.value
  if (!token) return null
  try {
    const payload = jwt.verify(token, JWT_SECRET) as SessionPayload
    if (payload.orgId !== ORG_ID) return null
    return payload
  } catch {
    return null
  }
}

export async function requireSession(): Promise<SessionPayload | null> {
  const session = await getSession()
  if (!session) return null
  // Confirm user still exists and belongs to this org
  const user = await prisma.user.findFirst({
    where: { id: session.userId, organizationId: ORG_ID },
  })
  if (!user) return null
  return session
}
