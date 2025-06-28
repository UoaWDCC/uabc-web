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
