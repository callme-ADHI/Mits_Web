// Deprecated: replaced by lib/session.ts. Kept only if any page still imports it.
// Do not use in new code.
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('mits_session')?.value
  if (!token) return null
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) return null
  try {
    const payload = jwt.verify(token, secret) as { userId: string; orgId?: string }
    return payload.userId
  } catch {
    return null
  }
}
