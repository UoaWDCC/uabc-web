import { z } from "zod"
import { PlayLevel } from "../types"
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

export const CreateBookingRequestBodySchema = BookingSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  user: true,
})

export const GetBookingsResponseSchema = z.object({
  data: z.array(BookingSchema),
})
