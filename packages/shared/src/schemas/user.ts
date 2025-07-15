import { z } from "zod"
import {
  type CreateUserData,
  type EditUserData,
  Gender,
  MembershipType,
  PlayLevel,
  University,
} from "../types"
import { MediaSchema } from "./media"
import { UserSchema } from "./auth"

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
  image: z.union([z.string(), z.null(), MediaSchema]),
}) satisfies z.ZodType<CreateUserData>

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>

export const UpdateUserRequestSchema =
  CreateUserRequestSchema.partial() satisfies z.ZodType<EditUserData>

export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>

export const GetAllUsersResponseSchema = z.object({
  data: z.array(UserSchema),
})

export const GetUserResponseSchema = z.object({
  data: UserSchema,
})
