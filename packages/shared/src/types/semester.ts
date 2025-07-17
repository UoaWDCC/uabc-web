import type { z } from "zod"
import type {
  CreateSemesterRequestSchema,
  GetSemesterResponseSchema,
  GetSemestersResponseSchema,
  UpdateSemesterRequestSchema,
} from "../schemas"

export type CreateSemesterRequest = z.infer<typeof CreateSemesterRequestSchema>
export type UpdateSemesterRequest = z.infer<typeof UpdateSemesterRequestSchema>
export type SemesterResponse = z.infer<typeof GetSemesterResponseSchema>
export type SemestersResponse = z.infer<typeof GetSemestersResponseSchema>
