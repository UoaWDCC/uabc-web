import { z } from "zod"
import type { CreateUserData, EditUserData } from "@/types"

export const CreateUserRequestSchema = z.object({
  firstName: z.string().min(1).max(30),
  lastName: z.string().nullable().optional(),
  email: z.string().email(),
  role: z.enum(["member", "casual", "admin"]),
  phoneNumber: z.string().nullable().optional(),
  playLevel: z.enum(["beginner", "intermediate", "advanced"]).nullable().optional(),
  gender: z
    .enum(["male", "female", "non-binary", "other", "prefer-not-to-answer"])
    .nullable()
    .optional(),
  dietaryRequirements: z.string().nullable().optional(),
  studentId: z.string().nullable().optional(),
  studentUpi: z.string().nullable().optional(),
  university: z
    .enum(["UoA", "AUT", "Massey University", "Other", "Working", "Not a student"])
    .nullable()
    .optional(),
  remainingSessions: z.number().nullable().optional(),
  image: z.string().nullable().optional(),
}) satisfies z.ZodType<CreateUserData>

export const UpdateUserRequestSchema =
  CreateUserRequestSchema.partial() satisfies z.ZodType<EditUserData>
