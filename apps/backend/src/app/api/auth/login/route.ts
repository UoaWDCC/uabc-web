import StandardSecurity from "@/business-layer/provider/standard"
import AuthService from "@/business-layer/services/AuthService"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import { AUTH_COOKIE_NAME } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
  const authDataService = new AuthDataService()
  const userDataService = new UserDataService()
  const authService = new AuthService()

  const { email, password }: { email: string; password: string } = await req.json()
  if (!StandardSecurity.validateDetails(email, password)) {
    return NextResponse.json({ status: StatusCodes.BAD_REQUEST })
  }

  const auth = await authDataService.getAuthByEmail(email)
  const passwordVerified = StandardSecurity.verifyPassword(password, auth.password as string)
  if (!passwordVerified) {
    return NextResponse.json({
      error: "Invalid email or password",
      status: StatusCodes.UNAUTHORIZED,
    })
  }

  const user = await userDataService.getUserByEmail(email)

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
