import type { Credentials } from "@repo/shared"
import { google } from "googleapis"

export const googleAuthScopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
]

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_URL}/api/auth/google/callback`,
)

export class GoogleProvider {
  /**
   * Attempts to fetch token credentials from Google and returns them if successful.
   * Returns `undefined` an error occurs or if the required properties are missing from the received tokens:
   * - `access_token`
   * - `expiry_date`
   * - `id_token`
   *
   * @param code The authorization code received from Google
   * @returns Either the token credentials or `undefined`
   */
  static async fetchTokens(code: string): Promise<Credentials | undefined> {
    try {
      const response = await oauth2Client.getToken(code)
      const tokens = response.tokens
      const requiredProperties = ["access_token", "expiry_date", "id_token"] as const
      const hasMissingToken = requiredProperties.some((key) => typeof tokens[key] === "undefined")

      if (!hasMissingToken) return tokens as Credentials
    } catch (error) {
      console.error(
        "[Google Provider] Something went wrong when attempting to fetch tokens. Further details below:\n",
        error,
      )
    }
  }

  /**
   * Attempts to revoke a provided Google OAuth2 access token.
   *
   * @param token The access token to revoke
   * @returns A boolean to determine whether the revocation was successful or not
   */
  static async revokeToken(token: string) {
    let success = true

    oauth2Client.revokeToken(token, (error) => {
      if (error) {
        console.error(
          "[Google Provider] Something went wrong when attempting to revoke tokens. Further details below:\n",
          error,
        )
        success = false
      }
    })

    return success
  }
}
