import { STATE_COOKIE_NAME, TOKEN_EXPIRY_TIME } from "@repo/shared"
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
  const params = req.nextUrl.searchParams
  const cookieStore = await cookies()
  const authDataService = new AuthDataService()
  const userDataService = new UserDataService()
  const authService = new AuthService()

  const stateParam = params.get("state") as string
  const cookieState = cookieStore.get(STATE_COOKIE_NAME)
  if (stateParam !== (cookieState?.value as string)) {
    return NextResponse.json({}, { status: StatusCodes.BAD_REQUEST })
  }
  cookieStore.delete(STATE_COOKIE_NAME)

  const { email, password } = await req.json()
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
