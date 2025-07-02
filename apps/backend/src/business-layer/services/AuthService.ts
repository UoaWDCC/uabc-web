import type { JWTEncryptedUser } from "@repo/shared"
import jwt, { type JwtPayload } from "jsonwebtoken"
import type z from "zod"

export default class AuthService {
  /**
   * Signs a JWT token with the provided payload and options and returns it.
   *
   * @param payload The {@link JWTEncryptedUser} payload to sign
   * @param options JWT options
   * @returns The signed JWT token
   */
  public signJWT(payload: JWTEncryptedUser, options?: jwt.SignOptions) {
    return jwt.sign(payload, process.env.JWT_SECRET, options)
  }

  /**
   * Decodes a JWT token and returns the payload.
   *
   * @param token The JWT token to decode
   * @returns The decoded JWT payload
   */
  private decodeJWT(token: string): JwtPayload | string {
    return jwt.verify(token, process.env.JWT_SECRET)
  }

  /**
   * Fetches data from the JWT token.
   *
   * @param token The JWT token to decode
   * @param schema The schema to validate the token against
   * @returns The parsed data if the token is valid, otherwise undefined
   */
  public getData<T extends z.ZodTypeAny>(token: string, schema: T): z.infer<T> | undefined {
    try {
      const decoded = this.decodeJWT(token)
      const parsed = schema.safeParse(decoded)
      return parsed.success ? parsed.data : undefined
    } catch {
      return undefined
    }
  }
}
