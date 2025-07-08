import { z } from "zod"
import type { Faq, FaqQuestion } from "../payload-types"
import { SerializedEditorStateSchema } from "./payload"

const FaqQuestionArraySchema = z.array(
  z.object({
    id: z.string().optional().nullable(),
    questionTitle: z.string(),
    description: SerializedEditorStateSchema,
  }),
) satisfies z.ZodType<FaqQuestion>

export const FaqSchema = z.object({
  id: z.string(),
  title: z.string(),
  questions: FaqQuestionArraySchema,
  updatedAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
}) satisfies z.ZodType<Faq>

export const GetFaqResponseSchema = z.object({
  data: FaqSchema,
})
