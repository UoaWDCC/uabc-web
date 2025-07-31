import z from "zod"
import { CommonResponseSchema } from "../response"
import { UserSchema } from "../user"

export const JWTEncryptedUserSchema = z.object({
  user: UserSchema,
  accessToken: z.string().optional(),
})

export const GoogleUserInfoResponseSchema = z.object({
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
  family_name: z.string().optional(),
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
  hd: z.string().optional(),
})

export const LoginRequestBodySchema = z.object({
  /**
   * The user's email address
   * @example straightzhao@gmail.com
   */
  email: z.string().min(1, "Field is required").email(),
  /**
   * The user's password
   * @example 12345678
   */
  password: z.string().min(1, "Field is required"),
})

export const LoginResponseSchema = CommonResponseSchema.extend({
  /**
   * The user's JWT token
   */
  data: z.string().optional(),
})

export const LoginFormDataSchema = LoginRequestBodySchema.extend({
  /**
   * Whether to remember the user's login session
   * @example true
   */
  rememberMe: z.boolean(),
})
