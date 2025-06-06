import StandardSecurity from "@/business-layer/provider/standard"
import AuthService from "@/business-layer/services/AuthService"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import { AUTH_COOKIE_NAME } from "@repo/shared"
import type { Authentication, User } from "@repo/shared/payload-types"
import { StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"

export const POST = async (req: NextRequest) => {
  const authDataService = new AuthDataService()
  const userDataService = new UserDataService()
  const authService = new AuthService()

  const { email, password }: { email: string; password: string } = await req.json()
  if (!StandardSecurity.validateDetails(email, password)) {
    return NextResponse.json({ status: StatusCodes.BAD_REQUEST })
  }

  let auth: Authentication
  let user: User
  try {
    auth = await authDataService.getAuthByEmail(email)
    user = await userDataService.getUserByEmail(email)
  } catch (error) {
    if (error instanceof NotFound) {
      return NextResponse.json({ status: StatusCodes.UNAUTHORIZED })
    }
    throw error
  }

  const passwordVerified = await StandardSecurity.verifyPassword(password, auth.password as string)
  if (!passwordVerified) {
    return NextResponse.json({ status: StatusCodes.UNAUTHORIZED })
  }

  const token = authService.signJWT({ user }, { expiresIn: "1h" })
  const response = NextResponse.redirect(new URL("/onboarding/name", req.url))

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60,
    path: "/",
  })

  return response
}
