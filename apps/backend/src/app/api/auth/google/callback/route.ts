import { googleAuthScopes, oauth2Client } from "@/business-layer/provider/google"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import {
  AUTH_COOKIE_NAME,
  MembershipType,
  type UserInfoResponse,
  UserInfoResponseSchema,
} from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

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
  if (!tokens.access_token || !tokens.expiry_date || !tokens.id_token) {
    return NextResponse.json(
      { error: "Error invalid google auth" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }

  const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  const {
    sub,
    email,
    family_name: lastName,
    given_name: firstName,
  }: UserInfoResponse = UserInfoResponseSchema.parse(await userInfoResponse.json())

  const userService = new UserDataService()
  let user = await userService.getUserByEmail(email)
  if (!user)
    user = await userService.createUser({ firstName, lastName, role: MembershipType.casual, email })

  const authService = new AuthDataService()
  await authService.createAuth({
    user,
    email: user.email,
    provider: "google",
    providerAccountId: sub,
    accessToken: tokens.access_token,
    expiresAt: tokens.expiry_date,
    scope: scopes.join(" "),
    idToken: tokens.id_token,
  })

  const jwtPayload = {
    profile: user,
    accessToken: tokens.access_token,
  }

  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "1h" })
  const response = NextResponse.redirect(new URL("/onboarding/name", req.url))

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60,
    path: "/",
  })

  return response
}
