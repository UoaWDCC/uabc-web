import { z } from "zod"
import type { LocationBubble } from "../../payload-types"
import { GameSessionScheduleSchema } from "../game-session-schedule"
import { LinkSchema } from "../link"
import { MediaSchema } from "../media"

export const LocationBubbleItemSchema = z.object({
  locationImage: z.union([z.string(), MediaSchema]),
  gameSessionSchedule: z.array(z.union([z.string(), GameSessionScheduleSchema])),
  button: LinkSchema,
  id: z.string().optional().nullable(),
})

export const LocationBubbleSchema = z.object({
  locationBubbleItems: z.array(LocationBubbleItemSchema).max(3),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
}) satisfies z.ZodType<Omit<LocationBubble, "id">>

export const GetLocationBubbleResponseSchema = z.object({
  data: LocationBubbleSchema,
})
