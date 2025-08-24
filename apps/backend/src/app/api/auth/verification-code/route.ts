import { MembershipType, VerificationCodeRequestSchema } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import AuthService from "@/business-layer/services/AuthService"
import MailService from "@/business-layer/services/MailService"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import {
  getVerificationCodeCoolDownDate,
  getVerificationCodeExpiryDate,
} from "@/data-layer/utils/DateUtils"

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

      // check that latest verification code is past cool down period
      const latestVerification = user.emailVerification?.[0] || null
      if (
        latestVerification &&
        getVerificationCodeCoolDownDate(new Date(latestVerification.createdAt)) > new Date()
      ) {
        return NextResponse.json(
          { error: "A verification code has already been sent recently" },
          { status: StatusCodes.TOO_MANY_REQUESTS },
        )
      }

      const newCodes = [
        {
          verificationCode: code,
          createdAt: new Date().toISOString(), // Use current date for createdAt
          expiresAt: getVerificationCodeExpiryDate().toISOString(),
        },
        ...(user.emailVerification || []).slice(0, 4), // Keep only the latest 5 codes
      ]

      await userDataService.updateUser(user.id, {
        emailVerification: newCodes,
      })
    } catch {
      await userDataService.createUser({
        firstName: email,
        email,
        emailVerification: [
          {
            verificationCode: code,
            createdAt: new Date().toISOString(), // Use current date for createdAt
            expiresAt: getVerificationCodeExpiryDate().toISOString(),
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
