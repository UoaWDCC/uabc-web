import { LoginDetailsSchema } from "@repo/shared"
import bcrypt from "bcryptjs"

export default class StandardSecurity {
  /**
   * Hashes a password using bcrypt.
   *
   * @static
   * @param password The password to hash
   * @returns The hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }

  /**
   * Verifies a password against a hash using bcrypt.
   *
   * @static
   * @param password The password to verify
   * @param hash The hash to verify against
   * @returns True if the password matches the hash, false otherwise
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  /**
   * Method to validate the login/signup data.
   *
   * @static
   * @param email The email of the user
   * @param password The password of the user
   * @returns True if the data is valid, false otherwise
   */
  static async validateDetails(email: string, password: string): Promise<boolean> {
    const parse = await LoginDetailsSchema.safeParseAsync({
      email,
      password,
    })

    if (parse.success) return true
    return false
  }
}
