import { z } from "zod"
import type { EmailVerification, User } from "../payload-types"
import {
  type CreateUserData,
  type EditSelfData,
  type EditUserData,
  Gender,
  MembershipType,
  PlayLevel,
} from "../types"
import { UniversityZodEnum } from "../types/enums"
import { MediaSchema } from "./media"
import { PaginationDataSchema } from "./query"

export const EmailVerificationCodeSchema = z.object({
  id: z.string().nullable().optional(),
  verificationCode: z.string(),
  createdAt: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
  expiresAt: z.string().datetime({ message: "Invalid date format, should be in ISO 8601 format" }),
}) satisfies z.ZodType<EmailVerification>

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string().nullable().optional(),
  email: z.string().email(),
  emailVerification: EmailVerificationCodeSchema,
  phoneNumber: z.string().nullable().optional(),
  // Payload generates a hard coded role type, the `satisfies` operator is used to ensure the type matches
  role: z.enum(["admin", "member", "casual"]),
  playLevel: z.enum(["beginner", "intermediate", "advanced"]).nullable().optional(),
  gender: z
    .enum(["male", "female", "non-binary", "other", "prefer-not-to-answer"])
    .nullable()
    .optional(),
  dietaryRequirements: z.string().nullable().optional(),
  studentId: z.string().nullable().optional(),
  studentUpi: z.string().nullable().optional(),
  university: UniversityZodEnum.nullable().optional(),
  remainingSessions: z.number().nullable().optional(),
  image: z.union([z.string(), MediaSchema]).nullable().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<User>

export const CreateUserRequestSchema = z.object({
  firstName: z.string().min(1).max(30),
  lastName: z.string().nullable().optional(),
  email: z.string().email(),
  emailVerification: EmailVerificationCodeSchema,
  role: z.nativeEnum(MembershipType),
  phoneNumber: z.string().nullable().optional(),
  playLevel: z.nativeEnum(PlayLevel).nullable().optional(),
  gender: z.nativeEnum(Gender).nullable().optional(),
  dietaryRequirements: z.string().nullable().optional(),
  studentId: z.string().nullable().optional(),
  studentUpi: z.string().nullable().optional(),
  university: UniversityZodEnum.nullable().optional(),
  remainingSessions: z.number().nullable().optional(),
  image: z.union([z.string(), MediaSchema]).nullable(),
}) satisfies z.ZodType<CreateUserData>

export const UpdateUserRequestSchema =
  CreateUserRequestSchema.partial() satisfies z.ZodType<EditUserData>

export const UpdateSelfRequestSchema = UpdateUserRequestSchema.strict().omit({
  email: true,
  remainingSessions: true,
  role: true,
}) satisfies z.ZodType<EditSelfData>

export const ProfileDetailsSchema = CreateUserRequestSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
}).extend({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(30, "First name must be at most 30 characters"),
  lastName: z.string().nullable().optional(),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().nullable().optional(),
})

export const AdditionalInfoSchema = CreateUserRequestSchema.pick({
  gender: true,
  playLevel: true,
  dietaryRequirements: true,
}).extend({
  gender: z
    .nativeEnum(Gender, { errorMap: () => ({ message: "Please select a gender" }) })
    .nullable()
    .optional(),
  playLevel: z
    .nativeEnum(PlayLevel, { errorMap: () => ({ message: "Please select a play level" }) })
    .nullable()
    .optional(),
  dietaryRequirements: z.string().nullable().optional(),
})

export const GetAllUsersResponseSchema = z.object({
  data: PaginationDataSchema.extend({
    docs: z.array(UserSchema),
  }),
})

export const GetUserResponseSchema = z.object({
  data: UserSchema,
})

export const OnboardedUserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string().nullable().optional(),
  email: z.string().email(),
  emailVerification: EmailVerificationCodeSchema,
  phoneNumber: z.string(),
  role: z.enum(["admin", "member", "casual"]),
  playLevel: z.enum(["beginner", "intermediate", "advanced"]),
  gender: z.enum(["male", "female", "non-binary", "other", "prefer-not-to-answer"]),
  dietaryRequirements: z.string().nullable().optional(),
  studentId: z.string().nullable().optional(),
  studentUpi: z.string().nullable().optional(),
  university: UniversityZodEnum,
  remainingSessions: z.number().nullable().optional(),
  image: z.union([z.string(), MediaSchema]).nullable().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<User>
