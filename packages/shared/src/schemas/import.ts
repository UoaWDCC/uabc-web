import z from "zod"
import { UserSchema } from "./user"

export const ImportErrorSchema = z.object({
  row: z.number(),
  errors: z.array(z.string()),
  data: z.any(),
})

export const ImportResultSchema = z.object({
  success: z.array(UserSchema),
  errors: z.array(ImportErrorSchema),
})

export const ImportUsersResponseSchema = z.object({
  data: z.object({
    imported: z.number(),
    failed: z.number(),
    errors: z.array(ImportErrorSchema),
  }),
})
