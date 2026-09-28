import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Edge-compatible JWT verification using the standard Web Crypto API.
// JWT_SECRET is read directly here (not from lib/env) because middleware
// runs in the Edge runtime. If the secret is missing, we treat all
// sessions as invalid (fail closed) rather than throwing.
async function verifyJwt(
  token: string,
  secret: string | undefined,
  orgId: string | undefined
): Promise<boolean> {
  if (!secret || secret.length < 32) return false
  if (!orgId) return false
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const [headerB64, payloadB64, signatureB64] = parts

    const payload = JSON.parse(
      atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))
    )
    if (payload.exp && Date.now() >= payload.exp * 1000) return false
    // Enforce org claim
    if (payload.orgId !== orgId) return false

    const encoder = new TextEncoder()
    const data = encoder.encode(`${headerB64}.${payloadB64}`)

    const binarySig = atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/'))
    const sigBytes = new Uint8Array(binarySig.length)
    for (let i = 0; i < binarySig.length; i++) {
      sigBytes[i] = binarySig.charCodeAt(i)
    }

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    return await crypto.subtle.verify('HMAC', key, sigBytes, data)
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('mits_session')?.value
  const secret = process.env.JWT_SECRET
  const orgId = process.env.ORGANIZATION_ID

  const isApi = req.nextUrl.pathname.startsWith('/api/')

  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const isValid = await verifyJwt(token, secret, orgId)
  if (!isValid) {
    if (isApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!login|api/auth/login|_next/static|_next/image|favicon.ico).*)'],
}
