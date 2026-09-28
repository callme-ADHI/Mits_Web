import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/session'
import { logActivity } from '@/lib/activityLog'
import { ORG_ID } from '@/lib/env'
import { readJson, validationError, unauthorized, handleDbError } from '@/lib/http'
import { changePasswordSchema } from '@/lib/validation'

export async function POST(req: Request) {
  const session = await requireSession()
  if (!session) return unauthorized()

  const body = await readJson(req)
  if (!body.ok) return body.response

  const parsed = changePasswordSchema.safeParse(body.data)
  if (!parsed.success) return validationError(parsed.error)

  const { currentPassword, newPassword } = parsed.data

  try {
    const user = await prisma.user.findFirst({
      where: { id: session.userId, organizationId: ORG_ID },
    })

    if (!user) {
      return unauthorized()
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect. Please try again.' },
        { status: 400 }
      )
    }

    const newHash = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    })

    await logActivity(
      ORG_ID,
      user.id,
      'auth.password_changed',
      `Admin password updated for ${user.email}`
    )

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (err) {
    return handleDbError(err)
  }
}
