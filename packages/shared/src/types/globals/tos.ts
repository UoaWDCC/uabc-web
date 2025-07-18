import type { GetTosResponseSchema } from "@repo/shared"
import type { z } from "zod"

export type GetTosResponse = z.infer<typeof GetTosResponseSchema>
