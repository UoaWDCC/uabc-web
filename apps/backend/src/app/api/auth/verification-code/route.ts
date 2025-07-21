import { MembershipType, VerificationCodeRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import AuthService from "@/business-layer/services/AuthService"
import MailService from "@/business-layer/services/MailService"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"

export const POST = async (req: NextRequest) => {
  const userDataService = new UserDataService()
  const authDataService = new AuthDataService()

  try {
    const body = await req.json()
    const { email } = VerificationCodeRequestSchema.parse(body)

    try {
      await authDataService.getAuthByEmail(email)
      return NextResponse.json(
        { error: "A user with that email already exists" },
        { status: StatusCodes.CONFLICT },
      )
    } catch {}

    const code = await AuthService.generateVerificationCode()

    try {
      const user = await userDataService.getUserByEmail(email)
      await userDataService.updateUser(user.id, {
        emailVerificationCode: code,
      })
    } catch {
      await userDataService.createUser({
        firstName: email,
        email,
        emailVerificationCode: code,
        role: MembershipType.casual,
      })
    }

    await MailService.sendEmailVerificationCode(email, code)
    return NextResponse.json({ message: "Verification code sent" })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: StatusCodes.BAD_REQUEST },
      )
    }
    console.error(error)
    return NextResponse.json(
      { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
