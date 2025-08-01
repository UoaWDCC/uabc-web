import { AUTH_COOKIE_NAME, JWTEncryptedUserSchema } from "@repo/shared"
import { cookies, headers } from "next/headers"
import AuthService from "../services/AuthService"
import { UnauthorizedAuthError } from "./errors"

/**
 * Used to authenticate a user based on the provided security name and scopes.
 *
 * @param securityName The security name, only JWT is supported
 * @param scopes The scopes to check for, if not provided, no scope check is performed
 * @returns A promise that resolves to the user object if the authentication is successful, otherwise rejects with an error
 */
export default async function authenticate(securityName: "jwt", scopes?: string[]) {
  if (securityName === "jwt") {
    const cookieStore = await cookies()
    const headersList = await headers()
    try {
      let token: string = cookieStore.get(AUTH_COOKIE_NAME)?.value || ""

      const authHeader = headersList.get("authorization") || ""
      if (!token && !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedAuthError("No token provided")
      }
      if (!token) token = authHeader.split(" ")[1] // Gets part after Bearer

      const authService = new AuthService()
      const decodedToken = authService.getData(token, JWTEncryptedUserSchema)
      if (!decodedToken) {
        throw new UnauthorizedAuthError("Invalid JWT token")
      }

      const { user } = decodedToken

      if (!scopes?.length) {
        return user
      }
      for (const scope of scopes) {
        if (user.role.includes(scope)) {
          return user
        }
      }

      throw new UnauthorizedAuthError("No scope")
    } catch (error) {
      if (!(error instanceof UnauthorizedAuthError)) console.error(error)
      throw error
    }
  }
  throw new Error("Unsupported security name")
}
