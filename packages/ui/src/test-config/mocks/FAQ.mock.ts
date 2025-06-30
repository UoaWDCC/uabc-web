import type { RichTextDescriptionSchema } from "@repo/shared"
import type { SerializedEditorState } from "@repo/ui/components/Generic/RichText/lib/types"
import type { z } from "zod"
import { createSimpleTextEditorState } from "./RichText.mock"

/**
 * Creates an FAQ item with the shared schema structure (questionTitle, description)
 * Compatible with the shared FaqQuestionItemSchema
 */
export const createSharedFAQItem = (
  questionTitle: string,
  description: SerializedEditorState,
  options?: { disabled?: boolean; id?: string | null },
) => ({
  questionTitle,
  description: description as z.infer<typeof RichTextDescriptionSchema>,
  id: options?.id ?? null,
  ...(options?.disabled !== undefined && { disabled: options.disabled }),
})

/**
 * Creates a simple FAQ item with shared schema structure
 */
export const createSimpleSharedFAQItem = (
  questionTitle: string,
  descriptionText: string,
  options?: { disabled?: boolean; id?: string | null },
) => createSharedFAQItem(questionTitle, createSimpleTextEditorState(descriptionText), options)
