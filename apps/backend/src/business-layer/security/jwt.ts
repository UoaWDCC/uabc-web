import jwt, { type JwtPayload } from "jsonwebtoken"
import type z from "zod"

export default class JWTDecoder {
  private token: string

  public constructor(token: string) {
    this.token = token
  }

  /**
   * Decodes a JWT token and returns the payload.
   *
   * @param token The JWT token to decode
   * @returns The decoded JWT payload
   */
  public decodeJWT(): JwtPayload | string {
    return jwt.verify(this.token, process.env.JWT_SECRET)
  }

  /**
   * Fetches data from the JWT token.
   * @param schema The schema to validate the token against
   * @returns The parsed data if the token is valid, otherwise undefined
   */
  public getData<T extends z.ZodTypeAny>(schema: T): z.infer<T> | undefined {
    try {
      const decoded = this.decodeJWT()
      const parsed = schema.safeParse(decoded)
      return parsed.success ? parsed.data : undefined
    } catch {
      return undefined
    }
  }
}
