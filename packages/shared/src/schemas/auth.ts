import z from "zod"
import type { User } from "../payload-types"
import { Gender, PlayLevel, University } from "../types"
import { MediaSchema } from "./media"
import { CommonResponse } from "./response"

// Payload User Schema
export const UserSchema = z.object({
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

// TODO: sort out discrepancy between this schema and RegisterPanelDetailsSchema
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

export const RegisterPanelDetailsSchema = z
  .object({
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
      .min(8, "Your password must be at least 8 characters")
      .regex(/[A-Z]/, "Your password must include an uppercase letter")
      .regex(/[a-z]/, "Your password must include a lowercase letter")
      .regex(/[0-9]/, "Your password must include a number")
      .regex(
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
        "Your password must include a special character",
      ),
    /**
     * The string entered by the user to confirm their password
     */
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const BasicInfoForm1Schema = z.object({
  /**
   * First name of the new user.
   */
  firstName: z.string().min(1, "Field is required"),
  /**
   * Last name of the new user.
   */
  lastName: z.string().min(1, "Field is required"),
})

export const BasicInfoForm2Schema = z.object({
  /**
   * Phone number of the new user.
   *
   * @remarks Current regex tests that it is a string with at least 1 number in it
   */
  phoneNumber: z.string().regex(/\d/, "Not a phone number"),
})

export const UniversityInfoFormSchema = z
  .object({
    /**
     * University of the new user
     *
     * @see {@link University}
     */
    university: z.nativeEnum(University, {
      errorMap: () => ({
        message: "Please select a University",
      }),
    }),
    /**
     * Student ID of the new user. Only required if user is from the UoA.
     * @example 610855188
     *
     * @remarks Current regex tests that it is a string of numbers at most 9 digits long.
     */
    studentId: z.string().optional(),
    /**
     * UPI of the new user. Only required if user is from the UoA.
     *
     * @remarks Current regex tests that it is of the form xxx111 or xxxx111
     * @example bond007
     */
    studentUpi: z.string().optional(),
  })
  .superRefine(({ university, studentId, studentUpi }, ctx) => {
    if (university === University.uoa) {
      if (!studentId) {
        ctx.addIssue({
          code: "custom",
          path: ["studentId"],
          message: "Field is required",
        })
      } else if (studentId.length > 9 || !/^\d+$/.test(studentId)) {
        ctx.addIssue({
          code: "custom",
          path: ["studentId"],
          message: "Invalid student ID",
        })
      }

      if (!studentUpi) {
        ctx.addIssue({
          code: "custom",
          path: ["studentUpi"],
          message: "Field is required",
        })
      } else if (!/^[a-z]{3,4}[0-9]{3}$/.test(studentUpi)) {
        ctx.addIssue({
          code: "custom",
          path: ["studentUpi"],
          message: "Invalid UPI",
        })
      }
    }
  })

export const AdditionalInfoFormSchema = z.object({
  /**
   * Gender of the new user
   */
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({
      message: "Please select a gender",
    }),
  }),
  /**
   * Skill level of the new user
   */
  skillLevel: z.nativeEnum(PlayLevel, {
    errorMap: () => ({
      message: "Please select a skill level",
    }),
  }),
  /**
   * Dietary requirements of the new user
   */
  dietaryRequirements: z.string(),
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

export const LoginFormDataSchema = LoginRequestBodySchema.extend({
  /**
   * Whether to remember the user's login session
   * @example true
   */
  rememberMe: z.boolean(),
})

export const LoginResponseSchema = CommonResponse.extend({
  /**
   * The user's JWT token
   */
  data: z.string().optional(),
})

export type JWTEncryptedUser = z.infer<typeof JWTEncryptedUserSchema>
export type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>
export type RegisterPanelDetails = z.infer<typeof RegisterPanelDetailsSchema>
export type BasicInfoForm1Values = z.infer<typeof BasicInfoForm1Schema>
export type BasicInfoForm2Values = z.infer<typeof BasicInfoForm2Schema>
export type UniversityInfoFormValues = z.infer<typeof UniversityInfoFormSchema>
export type AdditionalInfoFormValues = z.infer<typeof AdditionalInfoFormSchema>
export type LoginDetails = z.infer<typeof LoginDetailsSchema>
