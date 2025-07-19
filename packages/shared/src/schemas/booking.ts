import { z } from "zod"
import { type CreateBookingData, PlayLevel } from "../types"
import { UserSchema } from "./auth"
import { GameSessionSchema } from "./game-session"

export const BookingSchema = z.object({
  user: z.union([z.string(), UserSchema]),
  gameSession: z.union([z.string(), GameSessionSchema]),
  playerLevel: z.nativeEnum(PlayLevel),
}) satisfies z.ZodType<CreateBookingData>

export const CreateBookingRequestBodySchema = BookingSchema.omit({
  user: true,
})
