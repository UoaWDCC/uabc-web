import { z } from "zod"

export const MediaDocumentSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  alt: z.string().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  filename: z.string().optional(),
  mimeType: z.string().optional(),
  filesize: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const DocumentWithSlugSchema = z.object({
  id: z.string().optional(),
  slug: z.string(),
  title: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const LinkDocumentSchema = z.union([DocumentWithSlugSchema, z.string(), z.null()])

export const LinkFieldsSchema = z.object({
  linkType: z.enum(["custom", "internal"]),
  url: z.string().optional(),
  newTab: z.boolean().optional(),
  doc: LinkDocumentSchema.optional(),
})

export type MediaDocument = z.infer<typeof MediaDocumentSchema>
export type DocumentWithSlug = z.infer<typeof DocumentWithSlugSchema>
export type LinkDocument = z.infer<typeof LinkDocumentSchema>
export type LinkFields = z.infer<typeof LinkFieldsSchema>
