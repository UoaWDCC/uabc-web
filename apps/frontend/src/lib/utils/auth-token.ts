import { type JWT, JWTSchema } from "@repo/shared"
import jwt from "jsonwebtoken"

export class AuthToken {
  private token: string
  private _decoded?: string | jwt.JwtPayload
  private _data?: JWT
  private _verified = false

  public constructor(token: string) {
    this.token = token
  }

  /**
   * Verifies the token and caches the decoded payload.
   */
  private verifyToken(): void {
    if (this._verified) return

    try {
      this._decoded = jwt.verify(this.token, process.env.JWT_SECRET)
    } catch {
      this._decoded = undefined
    }

    this._verified = true
  }

  /**
   * Returns the decoded JWT payload if valid.
   * @public
   * @method
   */
  public get decoded(): string | jwt.JwtPayload | undefined {
    this.verifyToken()
    return this._decoded
  }

  /**
   * Returns the typed user data if the token is valid and matches schema.
   * @public
   * @method
   */
  public get data(): JWT | undefined {
    if (this._data !== undefined) return this._data

    const decoded = this.decoded
    if (!decoded) return undefined

    const parsed = JWTSchema.safeParse(decoded)
    if (!parsed.success) return undefined

    this._data = parsed.data
    return this._data
  }

  /**
   * Checks if the token is valid and schema passes.
   */
  public isValid(): boolean {
    return !!this.data
  }

  /**
   * Checks if user has a specific role.
   */
  public hasRole(role: string): boolean {
    return this.data?.user.role === role
  }

  public isAdmin(): boolean {
    return this.hasRole("admin")
  }

  public isMember(): boolean {
    return this.hasRole("member")
  }
}
