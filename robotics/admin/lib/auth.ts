import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('mits_session')?.value
  if (!token) return null
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    return payload.userId
  } catch {
    return null
  }
}
