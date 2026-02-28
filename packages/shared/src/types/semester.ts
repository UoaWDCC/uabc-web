import type { z } from "zod"
import type {
  CreateSemesterRequestSchema,
  GetAllSemestersResponseSchema,
  GetCurrentSemesterResponseSchema,
  GetSemesterResponseSchema,
  SemesterDatePopUpSchema,
  SemesterInfoPopUpSchema,
  SemesterNamePopUpSchema,
  UpdateSemesterRequestSchema,
} from "../schemas"

export type CreateSemesterRequest = z.infer<typeof CreateSemesterRequestSchema>
export type UpdateSemesterRequest = z.infer<typeof UpdateSemesterRequestSchema>
export type GetSemesterResponse = z.infer<typeof GetSemesterResponseSchema>
export type GetAllSemestersResponse = z.infer<typeof GetAllSemestersResponseSchema>
export type GetCurrentSemesterResponse = z.infer<typeof GetCurrentSemesterResponseSchema>
export type SemesterNamePopUpValues = z.infer<typeof SemesterNamePopUpSchema>
export type SemesterDatePopUpValues = z.infer<typeof SemesterDatePopUpSchema>
export type SemesterInfoPopUpValues = z.infer<typeof SemesterInfoPopUpSchema>
