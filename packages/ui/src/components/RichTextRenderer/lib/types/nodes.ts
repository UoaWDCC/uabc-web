import type { LinkType, ListType, NodeType } from "../constants"

export interface SerializedLexicalNode {
  type: string
  version: number
}

export interface SerializedTextNode extends SerializedLexicalNode {
  type: NodeType.TEXT
  text: string
  format?: number
}

export interface SerializedHeadingNode extends SerializedLexicalNode {
  type: NodeType.HEADING
  tag: string
  children: SerializedLexicalNode[]
}

export interface SerializedLinkNode extends SerializedLexicalNode {
  type: NodeType.LINK
  fields: {
    linkType: LinkType.CUSTOM | LinkType.INTERNAL
    url?: string
    newTab?: boolean
    doc?: unknown
  }
  children: SerializedLexicalNode[]
}

export interface SerializedUploadNode extends SerializedLexicalNode {
  type: NodeType.UPLOAD
  relationTo: string
  value: unknown
}

export interface SerializedParagraphNode extends SerializedLexicalNode {
  type: NodeType.PARAGRAPH
  children?: SerializedLexicalNode[]
}

export interface SerializedQuoteNode extends SerializedLexicalNode {
  type: NodeType.QUOTE
  children?: SerializedLexicalNode[]
}

export interface SerializedListNode extends SerializedLexicalNode {
  type: NodeType.LIST
  tag: ListType
  children?: SerializedLexicalNode[]
}

export interface SerializedListItemNode extends SerializedLexicalNode {
  type: NodeType.LIST_ITEM
  children?: SerializedLexicalNode[]
}

export interface SerializedLineBreakNode extends SerializedLexicalNode {
  type: NodeType.LINE_BREAK
}

export interface SerializedHorizontalRuleNode extends SerializedLexicalNode {
  type: NodeType.HORIZONTAL_RULE
}

export interface SerializedCodeNode extends SerializedLexicalNode {
  type: NodeType.CODE
  language?: string
  children?: SerializedLexicalNode[]
}

export interface SerializedNodeWithChildren extends SerializedLexicalNode {
  children: SerializedLexicalNode[]
}

export interface SerializedMediaDocument extends SerializedLexicalNode {
  type: NodeType.MEDIA
  url: string
  alt: string
}

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
