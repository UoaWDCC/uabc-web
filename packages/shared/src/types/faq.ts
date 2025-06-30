import type { z } from "zod"
import type { Faq } from "../payload-types"
import type { FaqQuestionItemSchema, FaqQuestionSchema, FaqSchema } from "../schemas/faq"

export type FaqSchemaType = z.infer<typeof FaqSchema>
export type FaqQuestionSchemaType = z.infer<typeof FaqQuestionSchema>
export type FaqQuestionItemSchemaType = z.infer<typeof FaqQuestionItemSchema>

export type CreateFaqData = Omit<Faq, "id" | "createdAt" | "updatedAt">

export type UpdateFaqData = Partial<CreateFaqData>

export type FaqApiResponse = {
  data: Faq
}

export type FaqGlobal = Faq

export type FaqGlobalApiResponse = FaqApiResponse
