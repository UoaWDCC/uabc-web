import z from "zod"

export const CommonResponse = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
})
