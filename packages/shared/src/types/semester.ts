import type { z } from "zod"
import type { CreateSemesterRequestSchema, UpdateSemesterRequestSchema } from "../schemas"

export type CreateSemesterRequest = z.infer<typeof CreateSemesterRequestSchema>
export type UpdateSemesterRequest = z.infer<typeof UpdateSemesterRequestSchema>
