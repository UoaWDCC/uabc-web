import { MembershipType, VerificationCodeRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import AuthService from "@/business-layer/services/AuthService"
import MailService from "@/business-layer/services/MailService"
import UserDataService from "@/data-layer/services/UserDataService"

export const POST = async (req: NextRequest) => {
  const userDataService = new UserDataService()

  try {
    const body = await req.json()
    const { email } = VerificationCodeRequestSchema.parse(body)

    const code = await AuthService.generateVerificationCode()
    await userDataService.createUser({
      firstName: email,
      email,
      emailVerificationCode: code,
      role: MembershipType.casual,
    })

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
