import { z } from "zod"
import { SerializedEditorStateSchema } from "../RichText/lib/schemas"

export const FAQItemSchema = z.object({
  question: z.string().min(1, "Question cannot be empty"),
  answer: SerializedEditorStateSchema,
  disabled: z.boolean().optional(),
})

export const FAQPropsSchema = z.object({
  title: z.string().optional(),
  items: z.array(FAQItemSchema).min(0, "Items array is required"),
  allowMultiple: z.boolean().optional(),
  allowToggle: z.boolean().optional(),
})

export type FAQItem = z.infer<typeof FAQItemSchema>

export type FAQPropsValidation = z.infer<typeof FAQPropsSchema>
