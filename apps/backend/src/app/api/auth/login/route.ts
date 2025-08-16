import { TOKEN_EXPIRY_TIME } from "@repo/shared"
import type { Authentication, User } from "@repo/shared/payload-types"
import { StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import StandardSecurity from "@/business-layer/provider/standard"
import AuthService from "@/business-layer/services/AuthService"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"

export const POST = async (req: NextRequest) => {
  const authDataService = new AuthDataService()
  const userDataService = new UserDataService()
  const authService = new AuthService()

  const { email, password } = await req.json()
  if (!(await StandardSecurity.validateLoginDetails(email, password))) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: StatusCodes.BAD_REQUEST },
    )
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

  if (!auth.password) {
    return NextResponse.json(
      { error: "Please login with Google" },
      { status: StatusCodes.CONFLICT },
    )
  }

  const passwordVerified = await StandardSecurity.verifyPassword(password, auth.password)
  if (!passwordVerified) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: StatusCodes.UNAUTHORIZED },
    )
  }

  // Omit remainingSessions from user before signing JWT (type-safe)
  const { remainingSessions: _omit, ...userWithoutSessions } = user
  const token = authService.signJWT({ user: userWithoutSessions }, { expiresIn: TOKEN_EXPIRY_TIME })
  const response = NextResponse.json(
    {
      data: token,
    },
    { status: StatusCodes.CREATED },
  )

  await authService.setCookie(token)

  return response
}
