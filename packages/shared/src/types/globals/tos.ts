import type { z } from "zod"
import type { GetTosResponseSchema } from "../../schemas"

export type GetTosResponse = z.infer<typeof GetTosResponseSchema>
