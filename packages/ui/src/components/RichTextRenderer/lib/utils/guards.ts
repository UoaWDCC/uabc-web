import { NodeType } from "../constants"
import {
  type DocumentWithSlug,
  DocumentWithSlugSchema,
  type LinkFields,
  LinkFieldsSchema,
  type MediaDocument,
  MediaDocumentSchema,
} from "../schemas"
import type {
  SerializedCodeNode,
  SerializedHeadingNode,
  SerializedHorizontalRuleNode,
  SerializedLexicalNode,
  SerializedLineBreakNode,
  SerializedLinkNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedNodeWithChildren,
  SerializedParagraphNode,
  SerializedQuoteNode,
  SerializedTextNode,
  SerializedUploadNode,
} from "../types"

export const isMediaDocument = (value: unknown): value is MediaDocument => {
  return MediaDocumentSchema.safeParse(value).success
}

export const isDocumentWithSlug = (value: unknown): value is DocumentWithSlug => {
  return DocumentWithSlugSchema.safeParse(value).success
}

export const isValidLinkFields = (fields: unknown): fields is LinkFields => {
  return LinkFieldsSchema.safeParse(fields).success
}

export const isTextNode = (node: SerializedLexicalNode): node is SerializedTextNode => {
  return node.type === NodeType.TEXT && "text" in node
}

export const isHeadingNode = (node: SerializedLexicalNode): node is SerializedHeadingNode => {
  return node.type === NodeType.HEADING && "tag" in node && "children" in node
}

export const isLinkNode = (node: SerializedLexicalNode): node is SerializedLinkNode => {
  return node.type === NodeType.LINK && "fields" in node && "children" in node
}

export const isUploadNode = (node: SerializedLexicalNode): node is SerializedUploadNode => {
  return node.type === NodeType.UPLOAD && "relationTo" in node && "value" in node
}

export const isParagraphNode = (node: SerializedLexicalNode): node is SerializedParagraphNode => {
  return node.type === NodeType.PARAGRAPH
}

export const isQuoteNode = (node: SerializedLexicalNode): node is SerializedQuoteNode => {
  return node.type === NodeType.QUOTE
}

export const isListNode = (node: SerializedLexicalNode): node is SerializedListNode => {
  return node.type === NodeType.LIST && "tag" in node
}

export const isListItemNode = (node: SerializedLexicalNode): node is SerializedListItemNode => {
  return node.type === NodeType.LIST_ITEM
}

export const isLineBreakNode = (node: SerializedLexicalNode): node is SerializedLineBreakNode => {
  return node.type === NodeType.LINE_BREAK
}

export const isHorizontalRuleNode = (
  node: SerializedLexicalNode,
): node is SerializedHorizontalRuleNode => {
  return node.type === NodeType.HORIZONTAL_RULE
}

export const isCodeNode = (node: SerializedLexicalNode): node is SerializedCodeNode => {
  return node.type === NodeType.CODE
}

export const hasChildren = (node: SerializedLexicalNode): node is SerializedNodeWithChildren => {
  return "children" in node && Array.isArray((node as SerializedNodeWithChildren).children)
}
