import type { AboutUsInfo } from "src/payload-types"
import z from "zod"

export const AboutUsInfoItemSchema = z.object({
  heading: z.string(),
  description: z.string(),
})

export const AboutUsInfoSchema = z.object({
  id: z.string(),
  items: z.array(AboutUsInfoItemSchema),
  updatedAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
}) satisfies z.ZodType<AboutUsInfo>

export const GetAboutUsInfoResponseSchema = z.object({
  data: AboutUsInfoSchema,
})
