export enum TextFormat {
  BOLD = 1,
  ITALIC = 2,
  STRIKETHROUGH = 4,
  UNDERLINE = 8,
  CODE = 16,
}

export enum NodeType {
  TEXT = "text",
  HEADING = "heading",
  PARAGRAPH = "paragraph",
  LINK = "link",
  UPLOAD = "upload",
  QUOTE = "quote",
  LIST = "list",
  LIST_ITEM = "listitem",
  LINE_BREAK = "linebreak",
  HORIZONTAL_RULE = "horizontalrule",
  CODE = "code",
}

export const HEADING_SIZE_MAP = {
  h1: "4xl",
  h2: "3xl",
  h3: "2xl",
  h4: "xl",
  h5: "lg",
  h6: "md",
} as const

export enum HeadingTag {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
}
