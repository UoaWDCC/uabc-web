import { z } from "zod"
import { LinkGroupSchema } from "./link"
import { MediaSchema } from "./media"

export const FooterSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  logo: MediaSchema,
  copyright: z.string(),
  credits: z.string(),
  linkGroup1: LinkGroupSchema.optional().nullable(),
  linkGroup2: LinkGroupSchema.optional().nullable(),
  facebook: z.string(),
  instagram: z.string(),
  linktree: z.string(),
  updatedAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
})

export const GetFooterResponseSchema = z.object({
  data: FooterSchema,
})
