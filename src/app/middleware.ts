import { type GoogleJWT, MembershipType } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import JWTDecoder from "../../apps/backend/src/business-layer/security/jwt"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/auth/google", req.url))
  }

  const jwt = new JWTDecoder(token)
  const data = jwt.decodeJWT() as GoogleJWT

  if (req.nextUrl.pathname.startsWith("/api/admin") && data.user.role !== MembershipType.admin) {
    return new NextResponse(null, { status: StatusCodes.FORBIDDEN })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/admin/:path*"],
}
