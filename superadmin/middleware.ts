import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Edge-compatible JWT verification using the standard Web Crypto API
async function verifyJwt(token: string, secret: string | undefined): Promise<boolean> {
  if (!secret || secret.length < 32) return false
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const [headerB64, payloadB64, signatureB64] = parts

    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')))
    if (payload.exp && Date.now() >= payload.exp * 1000) return false

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
  const token = req.cookies.get('mits_superadmin_session')?.value
  const secret = process.env.JWT_SECRET

  if (!token) return NextResponse.redirect(new URL('/login', req.url))

  const valid = await verifyJwt(token, secret)
  if (!valid) return NextResponse.redirect(new URL('/login', req.url))

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!login|api/auth/login|_next/static|_next/image|favicon.ico).*)'],
}
