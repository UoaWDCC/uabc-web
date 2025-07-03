import type { FaqQuestion } from "@repo/shared/payload-types"
import { z } from "zod"
import { SerializedEditorStateSchema } from "../RichText"

export type SharedFAQItem = FaqQuestion[number]

export const UIFAQItemSchema = z.object({
  questionTitle: z.string(),
  description: SerializedEditorStateSchema,
  id: z.string().nullable().optional(),
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
