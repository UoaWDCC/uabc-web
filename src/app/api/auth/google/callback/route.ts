import { googleAuthScopes, oauth2Client } from '@/business-layer/security/google'
import AuthService from '@/collections/services/AuthService'
import UserService from '@/collections/services/UserService'
import { UserInfoResponse, UserInfoResponseSchema } from '@/types/auth'
import { MembershipType } from '@/types/types'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  // Check if state matches the cookies
  const state = params.get('state')
  const cookieStore = await cookies()
  // Fetch the cookie stored state
  const cookieState = cookieStore.get('state')
  if (!state || !cookieState?.value || state.toString() !== cookieState.value.toString()) {
    return NextResponse.json(
      { error: "State missing, or state doesn't match browser state. " },
      {
        status: 400,
      },
    )
  }
  // Delete state when finished check
  cookieStore.delete('state')
  // Check if code exists
  const code = params.get('code')
  if (!code) return Response.json({ error: 'No code provided' }, { status: 400 })
  // Check if the scope matches
  const scope = params.get('scope')
  const scopes = scope?.split(' ')
  if (!scope || !scopes || googleAuthScopes.some((scope) => !scopes.includes(scope)))
    return Response.json({ error: 'No scope or invalid scopes provided' }, { status: 400 })
  // const prompt = params.get('prompt')
  let tokens

  try {
    const tokenFetchResponse = await oauth2Client.getToken(code)
    tokens = tokenFetchResponse.tokens
  } catch (error: unknown) {
    console.error(error)
    return Response.json(
      { error: 'Error ocurred while fetching Google auth access token' },
      { status: 500 },
    )
  }

  if (!tokens.access_token || !tokens.expiry_date || !tokens.id_token) {
    return Response.json(
      { error: 'Error ocurred while fetching Google auth access token' },
      { status: 500 },
    )
  }

  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  const {
    sub,
    // picture,
    // email_verified,
    email,
    family_name: lastName,
    given_name: firstName,
  }: UserInfoResponse = UserInfoResponseSchema.parse(await userInfoResponse.json())

  const userService = new UserService()
  let user
  try {
    user = await userService.getUserByEmail(email)
  } catch {
    user = await userService.createUser(
      firstName,
      lastName,
      MembershipType.casual,
      email,
      undefined,
      undefined, // https://github.com/payloadcms/payload/discussions/1713
      makeRandomPassword(),
    )
  }
  console.log(user)
  // Create authentication
  const authService = new AuthService()
  const newAuth = await authService.createAuth(
    user,
    'oauth',
    'google',
    sub,
    tokens.access_token,
    tokens.expiry_date,
    scope,
    tokens.id_token,
  )
  // Set access token to user cookies
  cookieStore.set('access_token', tokens.access_token)
  return Response.json(newAuth)
}

const makeRandomPassword = (length = 20) => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => characters[x % characters.length])
    .join('')
}
