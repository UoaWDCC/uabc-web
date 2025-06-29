import {
  type DocumentWithSlug,
  DocumentWithSlugSchema,
  LinkDocumentSchema,
  type LinkFields,
  LinkFieldsSchema,
  type MediaDocument,
  MediaDocumentSchema,
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
import type {
  LinkDocument,
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

export const isLinkDocument = (value: unknown): value is LinkDocument => {
  return LinkDocumentSchema.safeParse(value).success
}

export const isValidLinkFields = (fields: unknown): fields is LinkFields => {
  return LinkFieldsSchema.safeParse(fields).success
}

export const isTextNode = (node: SerializedLexicalNode): node is SerializedTextNode => {
  return SerializedTextNodeSchema.safeParse(node).success
}

export const isHeadingNode = (node: SerializedLexicalNode): node is SerializedHeadingNode => {
  return SerializedHeadingNodeSchema.safeParse(node).success
}

export const isLinkNode = (node: SerializedLexicalNode): node is SerializedLinkNode => {
  return SerializedLinkNodeSchema.safeParse(node).success
}

export const isUploadNode = (node: SerializedLexicalNode): node is SerializedUploadNode => {
  return SerializedUploadNodeSchema.safeParse(node).success
}

export const isParagraphNode = (node: SerializedLexicalNode): node is SerializedParagraphNode => {
  return SerializedParagraphNodeSchema.safeParse(node).success
}

export const isQuoteNode = (node: SerializedLexicalNode): node is SerializedQuoteNode => {
  return SerializedQuoteNodeSchema.safeParse(node).success
}

export const isListNode = (node: SerializedLexicalNode): node is SerializedListNode => {
  return SerializedListNodeSchema.safeParse(node).success
}

export const isListItemNode = (node: SerializedLexicalNode): node is SerializedListItemNode => {
  return SerializedListItemNodeSchema.safeParse(node).success
}

export const isLineBreakNode = (node: SerializedLexicalNode): node is SerializedLineBreakNode => {
  return SerializedLineBreakNodeSchema.safeParse(node).success
}

export const isHorizontalRuleNode = (
  node: SerializedLexicalNode,
): node is SerializedHorizontalRuleNode => {
  return SerializedHorizontalRuleNodeSchema.safeParse(node).success
}

export const isCodeNode = (node: SerializedLexicalNode): node is SerializedCodeNode => {
  return SerializedCodeNodeSchema.safeParse(node).success
}

export const hasChildren = (node: SerializedLexicalNode): node is SerializedNodeWithChildren => {
  return SerializedNodeWithChildrenSchema.safeParse(node).success
}
