import { z } from "zod"
import type { User } from "../payload-types"
import {
  type CreateUserData,
  type EditUserData,
  Gender,
  MembershipType,
  PlayLevel,
  University,
} from "../types"
import { MediaSchema } from "./media"

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string().nullable().optional(),
  email: z.string().email(),
  emailVerificationCode: z.string().nullable().optional(),
  // Payload generates a hard coded role type, the `satisfies` operator is used to ensure the type matches
  role: z.enum(["admin", "member", "casual"]),
  remainingSessions: z.number().nullable().optional(),
  image: z.union([z.string(), MediaSchema]).nullable().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<User>

export const CreateUserRequestSchema = z.object({
  firstName: z.string().min(1).max(30),
  lastName: z.string().nullable().optional(),
  email: z.string().email(),
  role: z.nativeEnum(MembershipType),
  phoneNumber: z.string().nullable().optional(),
  playLevel: z.nativeEnum(PlayLevel).nullable().optional(),
  gender: z.nativeEnum(Gender).nullable().optional(),
  dietaryRequirements: z.string().nullable().optional(),
  studentId: z.string().nullable().optional(),
  studentUpi: z.string().nullable().optional(),
  university: z.nativeEnum(University).nullable().optional(),
  remainingSessions: z.number().nullable().optional(),
  image: z.union([z.string(), MediaSchema]).nullable(),
}) satisfies z.ZodType<CreateUserData>

export const UpdateUserRequestSchema =
  CreateUserRequestSchema.partial() satisfies z.ZodType<EditUserData>

export const GetAllUsersResponseSchema = z.object({
  data: z.array(UserSchema),
})

export const GetUserResponseSchema = z.object({
  data: UserSchema,
})
