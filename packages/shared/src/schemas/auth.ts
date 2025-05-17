import z from "zod"
import { UserSchema } from "./user"

export const JWTSchema = z.object({
  user: UserSchema,
  access_token: z.string(),
})

export const UserInfoResponseSchema = z.object({
  /**
   * The unique ID of a Google user
   * @example 111111111111111111111
   */
  sub: z.string(),
  /**
   * The full name of the Google user
   * @example Straight Zhao
   */
  name: z.string(),
  /**
   * The user's first name
   * @example Straight
   */
  given_name: z.string(),
  /**
   * The user's first name
   * @example Zhao
   */
  family_name: z.string(),
  /**
   * The user's profile picture URL
   */
  picture: z.string(),
  /**
   * The user's email address
   * @example straightzhao@gmail.com
   */
  email: z.string().email(),
  email_verified: z.boolean(),
  /**
   * The hosted domain that the Google account is associated with
   * @example aucklanduni.ac.nz
   */
  hd: z.string(),
})

export const LoginDetailsSchema = z.object({
  /**
   * The user's email address
   * @example straightzhao@gmail.com
   */
  email: z.string().email(),
  /**
   * The user's password
   * @example 12345678
   */
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/) // Uppercase letters
    .regex(/[a-z]/) // Lowercase letters
    .regex(/[0-9]/) // Numbers
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/), // Special characters
})

export type JWT = z.infer<typeof JWTSchema>
export type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>
