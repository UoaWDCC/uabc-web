import type { z } from "zod"
import type {
  lexicalNodeSchema,
  SerializedCodeNodeSchema,
  SerializedHeadingNodeSchema,
  SerializedHorizontalRuleNodeSchema,
  SerializedLineBreakNodeSchema,
  SerializedLinkNodeSchema,
  SerializedListItemNodeSchema,
  SerializedListNodeSchema,
  SerializedNodeWithChildrenSchema,
  SerializedParagraphNodeSchema,
  SerializedQuoteNodeSchema,
  SerializedTextNodeSchema,
  SerializedUploadNodeSchema,
} from "../schemas"

export type SerializedLexicalNode = z.infer<typeof lexicalNodeSchema>
export type SerializedTextNode = z.infer<typeof SerializedTextNodeSchema>
export type SerializedHeadingNode = z.infer<typeof SerializedHeadingNodeSchema>
export type SerializedLinkNode = z.infer<typeof SerializedLinkNodeSchema>
export type SerializedUploadNode = z.infer<typeof SerializedUploadNodeSchema>
export type SerializedParagraphNode = z.infer<typeof SerializedParagraphNodeSchema>
export type SerializedQuoteNode = z.infer<typeof SerializedQuoteNodeSchema>
export type SerializedListNode = z.infer<typeof SerializedListNodeSchema>
export type SerializedListItemNode = z.infer<typeof SerializedListItemNodeSchema>
export type SerializedLineBreakNode = z.infer<typeof SerializedLineBreakNodeSchema>
export type SerializedHorizontalRuleNode = z.infer<typeof SerializedHorizontalRuleNodeSchema>
export type SerializedCodeNode = z.infer<typeof SerializedCodeNodeSchema>
export type SerializedNodeWithChildren = z.infer<typeof SerializedNodeWithChildrenSchema>

export interface SerializedEditorState {
  root: {
    children: SerializedLexicalNode[]
    direction: string | null
    format: string
    indent: number
    type: string
    version: number
  }
}
