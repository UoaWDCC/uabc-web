import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import { type NextRequest, NextResponse } from "next/server"

import { JWTResponseSchema } from "@/types/middleware"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value
  if (!token) return NextResponse.redirect(new URL("/auth/google", req.url))

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const response = JWTResponseSchema.safeParse(decoded)

    if (!response.success) return NextResponse.json({ status: StatusCodes.UNAUTHORIZED })

    if (req.nextUrl.pathname.startsWith("/api/admin")) {
      const data = response.data

      if (data.user.role !== "admin") {
        return NextResponse.json({ status: StatusCodes.FORBIDDEN })
      }
    }

    return NextResponse.next()
  } catch {
    // Invalid or expired token
    return NextResponse.redirect(new URL("/auth/google", req.url))
  }
}

export const config = {
  matcher: ["/api/admin/:path*"],
}
