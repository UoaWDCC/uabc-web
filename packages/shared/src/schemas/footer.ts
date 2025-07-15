import { z } from "zod"
import type { Footer } from "../payload-types"
import { LinkGroupSchema } from "./link"
import { MediaSchema } from "./media"

export const FooterSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  logo: MediaSchema,
  copyright: z.string(),
  credits: z.string(),
  linkGroup1: LinkGroupSchema,
  linkGroup2: LinkGroupSchema,
  facebook: z.string(),
  instagram: z.string(),
  linktree: z.string(),
  updatedAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
}) satisfies z.ZodType<Footer>

export const GetFooterResponseSchema = z.object({
  data: FooterSchema,
})
