import z from "zod"
import type { Faq, FaqQuestion } from "../payload-types"

const RichTextNodeSchema = z
  .object({
    type: z.string(),
    version: z.number(),
  })
  .and(z.record(z.unknown()))

const RichTextRootSchema = z.object({
  type: z.string(),
  children: z.array(RichTextNodeSchema),
  direction: z.enum(["ltr", "rtl"]).nullable(),
  format: z.enum(["left", "start", "center", "right", "end", "justify", ""]),
  indent: z.number(),
  version: z.number(),
})

const RichTextDescriptionSchema = z
  .object({
    root: RichTextRootSchema,
  })
  .and(z.record(z.unknown()))

const FaqQuestionItemSchema = z.object({
  questionTitle: z.string(),
  description: RichTextDescriptionSchema,
  id: z.string().nullable().optional(),
})

const FaqQuestionSchema = z.array(FaqQuestionItemSchema) satisfies z.ZodType<FaqQuestion>

const FaqSchema = z.object({
  id: z.string(),
  title: z.string(),
  questions: FaqQuestionSchema,
  updatedAt: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
}) satisfies z.ZodType<Faq>

export { FaqSchema, FaqQuestionSchema, FaqQuestionItemSchema, RichTextDescriptionSchema }
