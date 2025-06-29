import { z } from "zod"
import { LinkType } from "../constants"

export const DocumentWithSlugSchema = z.object({
  id: z.string(),
  slug: z.string(),
})

export const LinkDocumentSchema = z.object({
  value: DocumentWithSlugSchema,
})

export const LinkFieldsSchema = z
  .object({
    linkType: z.nativeEnum(LinkType).default(LinkType.CUSTOM),
    url: z.string().optional(),
    doc: z.union([z.string(), LinkDocumentSchema, DocumentWithSlugSchema]).optional().nullable(),
    newTab: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.linkType === LinkType.INTERNAL) {
      if (!data.doc) {
        ctx.addIssue({
          code: "custom",
          path: ["doc"],
          message: "doc is required when linkType is internal",
        })
      }
    } else if (data.linkType === LinkType.CUSTOM) {
      if (!data.url) {
        ctx.addIssue({
          code: "custom",
          path: ["url"],
          message: "url is required when linkType is custom",
        })
      }
    }
  })
