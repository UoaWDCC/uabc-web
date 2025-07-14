import z from "zod"
import type { User } from "../payload-types"
import { MediaSchema } from "./media"

// Payload User Schema
const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string().nullable().optional(),
  email: z.string().email(),
  // Payload generates a hard coded role type, the `satisfies` operator is used to ensure the type matches
  role: z.enum(["admin", "member", "casual"]),
  remainingSessions: z.number().nullable().optional(),
  image: z.union([z.string(), MediaSchema]).nullable().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<User>

// Google Authentication Payload JWT Schema
export const JWTEncryptedUserSchema = z.object({
  user: UserSchema,
  accessToken: z.string().optional(),
})

// Google User Info Schema
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

export const RegisterDetailsSchema = z.object({
  /**
   * The user's first name
   * @example John
   */
  firstName: z.string().min(1).max(30),
  /**
   * The user's last name
   * @example Doe
   */
  lastName: z.string().min(1).max(30),
  /**
   * The user's email address
   * @example straightzhao@gmail.com
   */
  email: z.string().email(),
  /**
   * The user's password (proper password scheme enforced)
   * @example str@!ghtZh@069
   */
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/) // Uppercase letters
    .regex(/[a-z]/) // Lowercase letters
    .regex(/[0-9]/) // Numbers
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/), // Special characters
})

export const LoginDetailsSchema = z.object({
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

export type JWTEncryptedUser = z.infer<typeof JWTEncryptedUserSchema>
export type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>
export type LoginDetails = z.infer<typeof LoginDetailsSchema>
