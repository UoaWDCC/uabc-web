import { GoogleUserInfoResponseSchema, MembershipType, TOKEN_EXPIRY_TIME } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { ZodError } from "zod"
import { googleAuthScopes, oauth2Client } from "@/business-layer/provider/google"
import AuthService from "@/business-layer/services/AuthService"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"

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
    ;({ sub, email, family_name, given_name } = GoogleUserInfoResponseSchema.parse(
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
        role: MembershipType.CASUAL,
        email,
      })
    } else {
      throw error
    }
  }

  const authDataService = new AuthDataService()
  try {
    const existingAuth = await authDataService.getAuthByEmail(email)
    await authDataService.updateAuth(existingAuth.id, {
      provider: "google",
      providerAccountId: sub,
      accessToken: tokens.access_token,
      expiresAt: tokens.expiry_date,
      scope: scopes.join(" "),
      idToken: tokens.id_token,
    })
  } catch (error) {
    if (error instanceof NotFound) {
      await authDataService.createAuth({
        email: user.email,
        provider: "google",
        providerAccountId: sub,
        accessToken: tokens.access_token,
        expiresAt: tokens.expiry_date,
        scope: scopes.join(" "),
        idToken: tokens.id_token,
      })
    } else {
      throw error
    }
  }

  const authService = new AuthService()

  /**
   * JWT token including user info and the Google access token.
   * Expires in 1 hour (same duration as Google access token)
   */
  const { remainingSessions: _omit, ...userWithoutSessions } = user
  const token = authService.signJWT(
    {
      user: userWithoutSessions,
      accessToken: tokens.access_token,
    },
    { expiresIn: TOKEN_EXPIRY_TIME },
  )

  const frontendUrl = new URL("/auth/callback", process.env.NEXT_PUBLIC_URL)
  frontendUrl.searchParams.set("token", token)

  return NextResponse.redirect(frontendUrl)
}
