import type { z } from "zod"
import type { FaqQuestionItemSchema, FaqQuestionSchema, FaqSchema } from "../schemas/faq"

export type FaqSchemaType = z.infer<typeof FaqSchema>
export type FaqQuestionSchemaType = z.infer<typeof FaqQuestionSchema>
export type FaqQuestionItemSchemaType = z.infer<typeof FaqQuestionItemSchema>
