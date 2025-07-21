import { z } from "zod"
import { type CreateBookingData, PlayLevel } from "../types"
import { GameSessionSchema } from "./game-session"
import { UserSchema } from "./user"

export const BookingSchema = z.object({
  user: z.union([z.string(), UserSchema]),
  gameSession: z.union([z.string(), GameSessionSchema]),
  playerLevel: z.nativeEnum(PlayLevel),
}) satisfies z.ZodType<CreateBookingData>

export const CreateBookingRequestBodySchema = BookingSchema.omit({
  user: true,
})

export const GetBookingsResponseSchema = z.object({
  data: z.array(
    BookingSchema.extend({
      id: z.string(),
      updatedAt: z.string(),
      createdAt: z.string(),
    }),
  ),
})
