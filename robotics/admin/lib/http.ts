import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import type { ZodError } from 'zod'

export async function readJson(req: Request) {
  try {
    return { ok: true as const, data: await req.json() }
  } catch {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: 'Request body must be valid JSON' },
        { status: 400 }
      ),
    }
  }
}

export function validationError(err: ZodError) {
  return NextResponse.json(
    { error: 'Please fix the highlighted fields', fields: err.flatten().fieldErrors },
    { status: 400 }
  )
}

export const unauthorized = () =>
  NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

export const notFound = () =>
  NextResponse.json({ error: 'Not found' }, { status: 404 })

export function handleDbError(err: unknown) {
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2025'
  ) {
    return notFound()
  }
  console.error(err) // full detail stays in the server log
  return NextResponse.json(
    { error: 'Something went wrong. Please try again.' },
    { status: 500 }
  )
}
