import type { z } from "zod"
import type { GetLocationBubbleResponseSchema } from "../../schemas"

export type GetLocationBubbleResponse = z.infer<typeof GetLocationBubbleResponseSchema>
