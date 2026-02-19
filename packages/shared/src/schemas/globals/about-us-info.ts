import z from "zod"
import type { AboutUsInfo } from "../../payload-types"
import { MediaSchema } from "../media"

export const AboutUsInfoItemSchema = z.object({
  title: z.string(),
  description: z.string(),
})

export const AboutUsInfoCarouselItemSchema = z.object({
  emoji: z.string(),
  image: MediaSchema,
})

export const AboutUsInfoSchema = z.object({
  items: z.array(AboutUsInfoItemSchema),
  carouselItems: z.array(AboutUsInfoCarouselItemSchema),
  updatedAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
}) satisfies z.ZodType<Omit<AboutUsInfo, "id">>

export const GetAboutUsInfoResponseSchema = z.object({
  data: AboutUsInfoSchema,
})
