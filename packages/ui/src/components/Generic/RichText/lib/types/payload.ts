import type { MediaSchema } from "@repo/shared"
import type { z } from "zod"
import type { DocumentWithSlugSchema, LinkDocumentSchema, LinkFieldsSchema } from "../schemas"

export type DocumentWithSlug = z.infer<typeof DocumentWithSlugSchema>
export type LinkDocument = z.infer<typeof LinkDocumentSchema>
export type LinkFields = z.infer<typeof LinkFieldsSchema>
export type MediaDocument = z.infer<typeof MediaSchema>
