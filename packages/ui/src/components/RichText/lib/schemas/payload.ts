import { z } from "zod"
import { LinkType } from "../constants"

export const DocumentWithSlugSchema = z.object({
  id: z.string(),
  slug: z.string(),
})

export const LinkDocumentSchema = z.object({
  value: DocumentWithSlugSchema,
})

export const MediaDocumentSchema = z
  .object({
    id: z.string().optional(),
    alt: z.string().nullish(),
    url: z.string().optional(),
    width: z.number().nullish(),
    height: z.number().nullish(),
    filename: z.string().optional(),
    mimeType: z.string().optional(),
    filesize: z.number().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.url && !data.filename) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either url or filename must be present",
      })
    }
  })

export const LinkFieldsSchema = z
  .object({
    linkType: z.nativeEnum(LinkType).default(LinkType.CUSTOM),
    url: z.string().optional(),
    doc: z.union([z.string(), LinkDocumentSchema, DocumentWithSlugSchema]).optional().nullable(),
    newTab: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.linkType === "internal") {
      if (!data.doc) {
        ctx.addIssue({
          code: "custom",
          path: ["doc"],
          message: "doc is required when linkType is internal",
        })
      }
    } else if (data.linkType === "custom") {
      if (!data.url) {
        ctx.addIssue({
          code: "custom",
          path: ["url"],
          message: "url is required when linkType is custom",
        })
      }
    }
  })
