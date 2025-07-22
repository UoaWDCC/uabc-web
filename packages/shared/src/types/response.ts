import type z from "zod"
import type { CommonResponseSchema } from "../schemas"

export type CommonResponse = z.infer<typeof CommonResponseSchema>
