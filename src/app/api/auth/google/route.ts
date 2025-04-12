import { googleAuthScopes, oauth2Client } from '@/business-layer/security/google'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const GET = async () => {
  const state = crypto.randomUUID().toString()
  const cookieStore = await cookies()
  // Set state to prevent CSRF attacks
  cookieStore.set('state', state)

  const authorizationUrl = oauth2Client.generateAuthUrl({
    scope: googleAuthScopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Set state for CSRF attack prevention
    state,
  })
  return redirect(authorizationUrl)
}
