import { googleAuthScopes, oauth2Client } from "@/business-layer/security/google"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import type { User } from "@/payload-types"
import { UserInfoResponseSchema } from "@/types/auth"
import { MembershipType } from "@/types/types"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { ZodError } from "zod"

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const cookieStore = await cookies()

  const state = params.get("state")
  const cookieState = cookieStore.get("state")
  if (!state || !cookieState?.value || state.toString() !== cookieState.value.toString()) {
    return NextResponse.json(
      { error: "State missing, or state doesn't match browser state. " },
      {
        status: StatusCodes.BAD_REQUEST,
      },
    )
  }
  cookieStore.delete("state")

  const code = params.get("code")
  if (!code)
    return NextResponse.json({ error: "No code provided" }, { status: StatusCodes.BAD_REQUEST })

  const scopes = params.get("scope")?.split(" ")
  if (!scopes || googleAuthScopes.some((requiredScope) => !scopes.includes(requiredScope)))
    return NextResponse.json(
      { error: "No scope or invalid scopes provided" },
      { status: StatusCodes.BAD_REQUEST },
    )

  let tokens: {
    access_token?: string | null
    expiry_date?: number | null
    id_token?: string | null
  } = {}

  try {
    const tokenFetchResponse = await oauth2Client.getToken(code)
    tokens = tokenFetchResponse.tokens
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json(
      { error: "Error invalid google auth" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }

  if (!tokens || !tokens.access_token || !tokens.expiry_date || !tokens.id_token) {
    return NextResponse.json(
      { error: "Error invalid google auth" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }

  const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  let sub: string
  let email: string
  let given_name: string
  let family_name: string | undefined

  try {
    ;({ sub, email, family_name, given_name } = UserInfoResponseSchema.parse(
      await userInfoResponse.json(),
    ))
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Error parsing user info response", error)
      return NextResponse.json(
        { error: "Error parsing user info response" },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
    throw error
  }

  const userService = new UserDataService()
  let user: User
  try {
    user = await userService.getUserByEmail(email)
  } catch (error) {
    if (error instanceof NotFound) {
      user = await userService.createUser({
        firstName: given_name,
        lastName: family_name,
        role: MembershipType.casual,
        email,
      })
    } else {
      throw error
    }
  }

  const authService = new AuthDataService()
  await authService.createAuth({
    user,
    type: "oauth",
    provider: "google",
    providerAccountId: sub,
    accessToken: tokens.access_token,
    expiresAt: tokens.expiry_date,
    scope: scopes.join(" "),
    idToken: tokens.id_token,
  })

  /**
   * JWT token including user info and the Google access token.
   * Expires in 1 hour (same duration as Google access token)
   */
  const token = jwt.sign(
    {
      profile: user,
      accessToken: tokens.access_token,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  )

  const response = NextResponse.json({ token })

  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60,
  })

  return response
}
