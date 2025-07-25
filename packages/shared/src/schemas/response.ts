import z from "zod"

export const CommonResponseSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
})
