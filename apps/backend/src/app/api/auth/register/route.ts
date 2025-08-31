import { RegisterRequestBodySchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { ZodError } from "zod"
import StandardSecurity from "@/business-layer/provider/standard"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"

export const POST = async (req: NextRequest) => {
  const userDataService = new UserDataService()
  const authDataService = new AuthDataService()

  try {
    const { email, password, emailVerificationCode } = RegisterRequestBodySchema.parse(
      await req.json(),
    )
    try {
      await authDataService.getAuthByEmail(email)
      return NextResponse.json(
        { error: "A user with that email already exists" },
        { status: StatusCodes.CONFLICT },
      )
    } catch (error) {
      if (!(error instanceof NotFound)) {
        throw error
      }
    }

    const user = await userDataService.getUserByEmail(email)

    if (
      !user.emailVerification[0].expiresAt ||
      new Date(user.emailVerification[0].expiresAt) < new Date()
    ) {
      return NextResponse.json(
        { error: "Latest email verification code has expired" },
        { status: StatusCodes.BAD_REQUEST },
      )
    }

    if (user.emailVerification[0].verificationCode !== emailVerificationCode) {
      return NextResponse.json(
        { error: "Invalid email verification code" },
        { status: StatusCodes.BAD_REQUEST },
      )
    }

    const hash = await StandardSecurity.hashPassword(password)
    await authDataService.createAuth({
      email: email,
      password: hash,
    })
    return NextResponse.json(
      { message: "User registered successfully" },
      {
        status: StatusCodes.CREATED,
      },
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: StatusCodes.BAD_REQUEST },
      )
    }
    if (error instanceof NotFound) {
      return NextResponse.json(
        {
          error: "Email not verified",
        },
        {
          status: StatusCodes.FORBIDDEN,
        },
      )
    }
    console.error(error)
    return NextResponse.json(
      { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
