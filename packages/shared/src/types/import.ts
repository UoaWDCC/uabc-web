import type {
  ImportErrorSchema,
  ImportResultSchema,
  ImportUsersResponseSchema,
} from "src/schemas/import"
import type z from "zod"

export type ImportError = z.infer<typeof ImportErrorSchema>
export type ImportResult = z.infer<typeof ImportResultSchema>
export type ImportUsersResponse = z.infer<typeof ImportUsersResponseSchema>
