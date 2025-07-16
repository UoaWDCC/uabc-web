import type { z } from "zod"
import type { CreateSemesterRequestSchema } from "@/schemas"

export type CreateSemesterRequest = z.infer<typeof CreateSemesterRequestSchema>
