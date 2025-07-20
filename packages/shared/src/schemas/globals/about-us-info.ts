import type { AboutUsInfo } from "src/payload-types"
import z from "zod"

export const AboutUsInfoItemSchema = z.object({
  title: z.string(),
  description: z.string(),
})

export const AboutUsInfoSchema = z.object({
  id: z.string().optional().nullable(),
  items: z.array(AboutUsInfoItemSchema),
  updatedAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
}) satisfies z.ZodType<Omit<AboutUsInfo, "id">>

export const GetAboutUsInfoResponseSchema = z.object({
  data: AboutUsInfoSchema,
})
