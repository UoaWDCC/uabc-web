import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { googleAuthScopes, oauth2Client } from '@/business-layer/security/google'
import AuthService from '@/collections/services/AuthService'
import UserService from '@/collections/services/UserService'
import { UserInfoResponse, UserInfoResponseSchema } from '@/types/auth'
import { MembershipType } from '@/types/types'

import jwt from 'jsonwebtoken'

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const cookieStore = await cookies()

  const state = params.get('state')
  const cookieState = cookieStore.get('state')
  if (!state || !cookieState?.value || state.toString() !== cookieState.value.toString()) {
    return NextResponse.json(
      { error: "State missing, or state doesn't match browser state. " },
      {
        status: 400,
      },
    )
  }
  cookieStore.delete('state')

  const code = params.get('code')
  if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 })

  const scopes = params.get('scope')?.split(' ')
  if (!scopes || googleAuthScopes.some((requiredScope) => !scopes.includes(requiredScope)))
    return NextResponse.json({ error: 'No scope or invalid scopes provided' }, { status: 400 })

  let tokens
  try {
    const tokenFetchResponse = await oauth2Client.getToken(code)
    tokens = tokenFetchResponse.tokens
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({ error: 'Error invalid google auth' }, { status: 500 })
  }
  if (!tokens.access_token || !tokens.expiry_date || !tokens.id_token) {
    return NextResponse.json({ error: 'Error invalid google auth' }, { status: 500 })
  }

  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  const {
    sub,
    email,
    family_name: lastName,
    given_name: firstName,
  }: UserInfoResponse = UserInfoResponseSchema.parse(await userInfoResponse.json())

  const userService = new UserService()
  let user = await userService.getUserByEmail(email)
  if (!user)
    user = await userService.createUser({ firstName, lastName, role: MembershipType.casual, email })

  const authService = new AuthService()
  await authService.createAuth({
    user,
    type: 'oauth',
    provider: 'google',
    providerAccountId: sub,
    accessToken: tokens.access_token,
    expiresAt: tokens.expiry_date,
    scope: scopes.join(' '),
    idToken: tokens.id_token,
  })

  /**
   * JWT token including user info and the Google access token.
   * Expires in 1 hour (same duration as Google access token)
   */
  const token = jwt.sign(
    {
      profile: user,
      accessToken: tokens.access_token
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )

  const response = NextResponse.json({ token })

  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',
    maxAge: 60 * 60,
  })

  return response
}
