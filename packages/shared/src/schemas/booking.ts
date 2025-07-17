import { z } from "zod"
import type { GameSession, User } from "@/payload-types"
import { type CreateBookingData, PlayLevel } from "@/types"

export const BookingSchema = z.object({
  user: z.union([z.string(), z.custom<User>()]),
  gameSession: z.union([z.string(), z.custom<GameSession>()]),
  playerLevel: z.nativeEnum(PlayLevel),
}) satisfies z.ZodType<CreateBookingData>

export type BookingType = z.infer<typeof BookingSchema>
