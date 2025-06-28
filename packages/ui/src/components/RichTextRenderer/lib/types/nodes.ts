// Basic Lexical node interface
export interface SerializedLexicalNode {
  type: string
  version: number
}

// Extended Lexical node types
export interface SerializedTextNode extends SerializedLexicalNode {
  type: "text"
  text: string
  format?: number
}

export interface SerializedHeadingNode extends SerializedLexicalNode {
  type: "heading"
  tag: string
  children: SerializedLexicalNode[]
}

export interface SerializedLinkNode extends SerializedLexicalNode {
  type: "link"
  fields: {
    linkType: "custom" | "internal"
    url?: string
    newTab?: boolean
    doc?: unknown
  }
  children: SerializedLexicalNode[]
}

export interface SerializedUploadNode extends SerializedLexicalNode {
  type: "upload"
  relationTo: string
  value: unknown
}

export interface SerializedParagraphNode extends SerializedLexicalNode {
  type: "paragraph"
  children?: SerializedLexicalNode[]
}

export interface SerializedQuoteNode extends SerializedLexicalNode {
  type: "quote"
  children?: SerializedLexicalNode[]
}

export interface SerializedListNode extends SerializedLexicalNode {
  type: "list"
  tag: "ol" | "ul"
  children?: SerializedLexicalNode[]
}

export interface SerializedListItemNode extends SerializedLexicalNode {
  type: "listitem"
  children?: SerializedLexicalNode[]
}

export interface SerializedLineBreakNode extends SerializedLexicalNode {
  type: "linebreak"
}

export interface SerializedHorizontalRuleNode extends SerializedLexicalNode {
  type: "horizontalrule"
}

export interface SerializedCodeNode extends SerializedLexicalNode {
  type: "code"
  language?: string
  children?: SerializedLexicalNode[]
}

export interface SerializedNodeWithChildren extends SerializedLexicalNode {
  children: SerializedLexicalNode[]
}

export interface SerializedMediaDocument extends SerializedLexicalNode {
  type: "media"
  url: string
  alt: string
}

// Editor state
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
