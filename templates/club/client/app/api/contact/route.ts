import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ORG_ID } from '@/lib/env'

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Enter a valid email address').max(200),
  message: z.string().trim().min(1, 'Message is required').max(2000),
  // Honeypot field — must be empty
  company: z.string().max(200).optional(),
})

// Simple in-memory rate limit: 5 submissions per IP per 10 minutes
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  )
  if (timestamps.length >= RATE_LIMIT_MAX) return false
  timestamps.push(now)
  rateLimitMap.set(ip, timestamps)
  return true
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please fix the highlighted fields', fields: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  // Honeypot check: if the hidden field is filled, return 200 but store nothing
  if (parsed.data.company && parsed.data.company.trim().length > 0) {
    return NextResponse.json({ success: true }, { status: 200 })
  }

  // Rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many messages. Please try again later.' },
      { status: 429 }
    )
  }

  await prisma.contactMessage.create({
    data: {
      organizationId: ORG_ID,
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
