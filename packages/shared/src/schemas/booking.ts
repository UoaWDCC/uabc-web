import { z } from "zod"
import type { EditBookingData } from "../types"
import { GameSessionSchema } from "./game-session"
import { CommonResponseSchema } from "./response"
import { UserSchema } from "./user"

export const BookingSchema = z.object({
  id: z.string(),
  user: z.union([z.string(), UserSchema]),
  gameSession: z.union([z.string(), GameSessionSchema]),
  playerLevel: z.enum(["beginner", "intermediate", "advanced"]),
  updatedAt: z.string(),
  createdAt: z.string(),
})

export const CreateBookingRequestSchema = BookingSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  user: true,
})

export const GetBookingsResponseSchema = z.object({
  data: z.array(BookingSchema),
})

export const CommonBookingResponseSchema = CommonResponseSchema.extend({
  data: BookingSchema.optional(),
})

export const UpdateBookingRequestSchema =
  CreateBookingRequestSchema.partial() satisfies z.ZodType<EditBookingData>
