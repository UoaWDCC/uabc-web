import { RegisterDetailsSchema } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
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
    let user: User
    const parsedBody = RegisterDetailsSchema.parse(await req.json())
    try {
      await authDataService.getAuthByEmail(parsedBody.email)
      return NextResponse.json(
        { error: "A user with that email already exists" },
        { status: StatusCodes.CONFLICT },
      )
    } catch (error) {
      if (!(error instanceof NotFound)) {
        throw error
      }
    }
    user = await userDataService.createUser({ ...parsedBody, role: "casual" })

    const hash = await StandardSecurity.hashPassword(parsedBody.password)
    await authDataService.createAuth({
      email: parsedBody.email,
      password: hash,
      user: user,
    })
    return NextResponse.json(
      { message: "User registered successfully", data: user },
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
    console.error("Error", error)
    return NextResponse.json(
      { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
