import { MembershipType, VerificationCodeRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import AuthService from "@/business-layer/services/AuthService"
import MailService from "@/business-layer/services/MailService"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import { getVerificationCodeExpiryDate } from "@/data-layer/utils/DateUtils"

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

      // remove expired verification codes
      const now = new Date()
      const userEmailVerification = user.emailVerification || []
      const validCodes = userEmailVerification.filter(
        (verification) => new Date(verification.expiresAt) > now,
      )

      // check if user has max number of verification codes (5)
      if (userEmailVerification.length >= 5) {
        return NextResponse.json(
          { error: "Maximum number of verification codes reached" },
          { status: StatusCodes.TOO_MANY_REQUESTS },
        )
      }
      await userDataService.updateUser(user.id, {
        emailVerification: [
          ...validCodes,
          {
            verificationCode: code,
            createdAt: now.toISOString(),
            expiresAt: getVerificationCodeExpiryDate(now).toISOString(),
          },
        ],
      })
    } catch {
      const verificationCreatedAt = new Date() // Use current date for createdAt
      await userDataService.createUser({
        firstName: email,
        email,
        emailVerification: [
          {
            verificationCode: code,
            createdAt: verificationCreatedAt.toISOString(),
            expiresAt: getVerificationCodeExpiryDate(verificationCreatedAt).toISOString(),
          },
        ],
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
