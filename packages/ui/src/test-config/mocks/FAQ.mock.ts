import type { UIFAQItem } from "@repo/ui/components/Generic"
import type {
  SerializedEditorState,
  SerializedEditorStateSchema,
} from "@repo/ui/components/Generic/RichText"
import type { z } from "zod"
import { createSimpleTextEditorState } from "./RichText.mock"

/**
 * Creates an FAQ item with the shared schema structure (questionTitle, description)
 * Compatible with the shared SerializedEditorStateSchema
 */
export const createSharedFAQItem = (
  questionTitle: string,
  description: SerializedEditorState,
  options?: { disabled?: boolean; id?: string | null },
) => ({
  questionTitle,
  description: description as z.infer<typeof SerializedEditorStateSchema>,
  id: options?.id ?? null,
  ...(options?.disabled !== undefined && { disabled: options.disabled }),
})

/**
 * Creates a simple FAQ item for testing purposes
 * Compatible with the shared SerializedEditorStateSchema
 */
export function createSimpleSharedFAQItem(
  questionTitle: string,
  descriptionText: string,
  options: { disabled?: boolean } = {},
): UIFAQItem {
  return {
    questionTitle,
    description: createSimpleTextEditorState(descriptionText),
    disabled: options.disabled,
  }
}
