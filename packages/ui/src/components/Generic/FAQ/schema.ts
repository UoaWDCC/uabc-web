import {
  FaqQuestionItemSchema,
  type FaqQuestionItemSchemaType,
  RichTextDescriptionSchema,
} from "@repo/shared"
import { z } from "zod"

export const UIFAQItemSchema = FaqQuestionItemSchema.extend({
  disabled: z.boolean().optional(),
})

export const UIFAQPropsSchema = z.object({
  title: z.string().optional(),
  items: z.array(UIFAQItemSchema),
  allowMultiple: z.boolean().optional(),
  allowToggle: z.boolean().optional(),
})

export type UIFAQItem = z.infer<typeof UIFAQItemSchema>
export type UIFAQPropsValidation = z.infer<typeof UIFAQPropsSchema>

export type SharedFAQItem = FaqQuestionItemSchemaType
export { RichTextDescriptionSchema }
