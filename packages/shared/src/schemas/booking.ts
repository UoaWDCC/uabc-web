import { z } from "zod"
import { type EditBookingData, PlayLevel } from "../types"
import { GameSessionSchema } from "./game-session"
import { UserSchema } from "./user"

export const BookingSchema = z.object({
  id: z.string(),
  user: z.union([z.string(), UserSchema]),
  gameSession: z.union([z.string(), GameSessionSchema]),
  playerLevel: z.nativeEnum(PlayLevel),
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

export const SelectACourtFormDataSchema = z.object({
  bookingTimes: z.array(z.string()).min(1, "Please select at least one session"),
})

export const QuickBookFormDataSchema = z.object({
  locationAndTimeId: z
    .string({ required_error: "Please select a location and time" })
    .min(1, "Please select a location and time"),
  skillLevel: z.nativeEnum(PlayLevel, {
    required_error: "Please select your skill level",
    invalid_type_error: "Please select your skill level",
  }),
})

export const QuickBookLocalStorageSchema = z.object({
  formData: QuickBookFormDataSchema,
  timestamp: z.string(),
})

export const UpdateBookingRequestSchema =
  CreateBookingRequestSchema.partial() satisfies z.ZodType<EditBookingData>
