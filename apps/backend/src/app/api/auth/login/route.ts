import { TOKEN_EXPIRY_TIME } from "@repo/shared"
import type { Authentication, User } from "@repo/shared/payload-types"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import StandardSecurity from "@/business-layer/provider/standard"
import AuthService from "@/business-layer/services/AuthService"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"

export const POST = async (req: NextRequest) => {
  const cookieStore = await cookies()
  const authDataService = new AuthDataService()
  const userDataService = new UserDataService()
  const authService = new AuthService()

  const { email, password } = await req.json()
  if (!StandardSecurity.validateLoginDetails(email, password)) {
    return NextResponse.json({ status: StatusCodes.BAD_REQUEST })
  }

  let auth: Authentication
  let user: User
  try {
    auth = await authDataService.getAuthByEmail(email)
    user = await userDataService.getUserByEmail(email)
  } catch (error) {
    if (error instanceof NotFound) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: StatusCodes.UNAUTHORIZED },
      )
    }
    throw error
  }

  const passwordVerified = await StandardSecurity.verifyPassword(password, auth.password as string)
  if (!passwordVerified) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: StatusCodes.UNAUTHORIZED },
    )
  }

  const token = authService.signJWT({ user }, { expiresIn: TOKEN_EXPIRY_TIME })
  const response = NextResponse.json({}, { status: StatusCodes.CREATED })

  authService.setCookie(cookieStore, token)

  return response
}
