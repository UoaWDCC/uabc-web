import jwt, { type JwtPayload } from "jsonwebtoken"
import type z from "zod"

export default class AuthService {
  /**
   * Decodes a JWT token and returns the payload.
   *
   * @param token The JWT token to decode
   * @returns The decoded JWT payload
   */
  public decodeJWT(token: string): JwtPayload | string {
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
