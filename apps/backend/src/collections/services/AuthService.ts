import configPromise from "@payload-config"
import { type CreateAuthenticationData, LoginDetailsSchema } from "@repo/shared"
import type { Authentication, User } from "@repo/shared/payload-types"
import bcrypt from "bcryptjs"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { getPayload } from "payload"

const payload = await getPayload({
  config: configPromise,
})

export default class AuthService {
  /**
   * Method to create an authentication document.
   * @param param0 The data to create an Authentication with
   * @returns The Authentication document
   */
  public async createAuth(newAuth: CreateAuthenticationData): Promise<Authentication> {
    return await payload.create({
      collection: "authentication",
      data: newAuth,
    })
  }

  /**
   * Hashes a password using bcrypt.
   * @param password The password to hash
   * @returns The hashed password
   */
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }

  /**
   * Verifies a password against a hash using bcrypt.
   * @param password The password to verify
   * @param hash The hash to verify against
   * @returns True if the password matches the hash, false otherwise
   */
  public async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  /**
   * Method to verify if the user entered valid credentials.
   * @param email The email of the user
   * @param password The password of the user
   * @returns True if the details are valid, false otherwise
   */
  public async verifyLogin(email: string, password: string): Promise<boolean> {
    const auth = await payload.find({
      collection: "authentication",
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (auth?.docs?.length) {
      const hashedPassword = auth.docs[0].password

      if (hashedPassword) {
        return await this.verifyPassword(password, hashedPassword)
      }
    }

    return false
  }

  /**
   * Method to validate the login/signup data.
   * @param email The email of the user
   * @param password The password of the user
   * @returns True if the data is valid, false otherwise
   */
  public async validateDetails(email: string, password: string): Promise<boolean> {
    const parse = await LoginDetailsSchema.safeParseAsync({
      email,
      password,
    })

    if (parse.success) return true
    return false
  }

  /**
   * Generates a JWT token for the given user and access token.
   *
   * @param user The user data to tokenize
   * @param accessToken The Google OAuth access token to include in the JWT payload
   * @returns The generated JWT token
   */
  public generateJWT(user: User, accessToken?: string): string {
    return jwt.sign(
      {
        profile: user,
        accessToken,
      },
      process.env.JWT_SECRET,
      /**
       * JWT token including user info and the Google access token.
       * Expires in 1 hour (same duration as Google access token)
       */
      { expiresIn: "1h" },
    )
  }

  /**
   * Decodes a JWT token and returns the payload.
   *
   * @param token The JWT token to decode
   * @returns The decoded JWT payload
   */
  public decodeJWT(token: string): JwtPayload | string {
    return jwt.verify(token, process.env.JWT_SECRET)
  }
}
