import { AuthToken } from '@/lib/utils/auth-token'
import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/auth/google', req.url))
  }

  const auth = new AuthToken(token)

  if (!auth.isValid()) {
    return new NextResponse(null, { status: StatusCodes.UNAUTHORIZED })
  }

  if (req.nextUrl.pathname.startsWith('/api/admin') && !auth.isAdmin()) {
    return new NextResponse(null, { status: StatusCodes.FORBIDDEN })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*'],
}
