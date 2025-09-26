import z from "zod"

export const CommonResponseSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
})

export const DeleteResponseSchema = z
  .object({
    message: z.string().optional(),
    success: z.boolean().optional(),
  })
  .optional()
