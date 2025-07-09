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
  MEDIA = "media",
  ROOT = "root",
  CUSTOM = "custom",
  RELATIONSHIP = "relationship",
}

export enum LinkType {
  CUSTOM = "custom",
  INTERNAL = "internal",
}

export enum ListType {
  ORDERED = "ol",
  UNORDERED = "ul",
}
