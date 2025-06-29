import type { z } from "zod"

export * from "./payload"
export * from "./nodes"

import type {
  DocumentWithSlugSchema,
  LinkDocumentSchema,
  LinkFieldsSchema,
  MediaDocumentSchema,
} from "./payload"

export type MediaDocument = z.infer<typeof MediaDocumentSchema>
export type DocumentWithSlug = z.infer<typeof DocumentWithSlugSchema>
export type LinkDocument = z.infer<typeof LinkDocumentSchema>
export type LinkFields = z.infer<typeof LinkFieldsSchema>
