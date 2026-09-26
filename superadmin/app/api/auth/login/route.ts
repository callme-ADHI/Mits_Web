import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const admin = await prisma.superAdmin.findUnique({ where: { email } })
  if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const valid = await bcrypt.compare(password, admin.passwordHash)
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET!, { expiresIn: '8h' })

  const response = NextResponse.json({ name: admin.name })
  response.cookies.set('mits_superadmin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
  return response
}
