import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { googleAuthScopes, oauth2Client } from "@/business-layer/provider/google"

export const GET = async () => {
  const state = crypto.randomUUID().toString()
  const cookieStore = await cookies()
  // Set state to prevent CSRF attacks
  cookieStore.set("state", state, { maxAge: 60 })

  const authorizationUrl = oauth2Client.generateAuthUrl({
    scope: googleAuthScopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Set state for CSRF attack prevention
    state,
  })
  return redirect(authorizationUrl)
}
