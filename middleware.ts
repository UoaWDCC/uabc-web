import { type NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  if (!token) return NextResponse.redirect(new URL('/auth/google', req.url))

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string
      email: string
      role: string
    }

    if (req.nextUrl.pathname.startsWith('/api/admin')) {
      if (decoded.role !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden: admin level access is required' },
          { status: 403 },
        )
      }
    }

    return NextResponse.next()
  } catch {
    // Invalid or expired token
    return NextResponse.redirect(new URL('/auth/google', req.url))
  }
}

export const config = {
  matcher: ['/api/admin/:path*'],
}
