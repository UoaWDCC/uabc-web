import type {
  SerializedCodeNode,
  SerializedEditorState,
  SerializedHeadingNode,
  SerializedHorizontalRuleNode,
  SerializedLineBreakNode,
  SerializedLinkNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedParagraphNode,
  SerializedQuoteNode,
  SerializedTextNode,
  SerializedUploadNode,
} from "@repo/shared"
import { LinkType, ListType, NodeType, TextFormat } from "@repo/shared"

export const createTextNode = (text: string, format?: TextFormat): SerializedTextNode => ({
  type: NodeType.TEXT,
  text,
  format,
  version: 1,
})

export const createHeadingNode = (
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h1",
  text = "Sample Heading",
): SerializedHeadingNode => ({
  type: NodeType.HEADING,
  tag,
  version: 1,
  children: [createTextNode(text)],
})

export const createParagraphNode = (
  children: (SerializedTextNode | SerializedLinkNode)[],
): SerializedParagraphNode => ({
  type: NodeType.PARAGRAPH,
  version: 1,
  children,
})

export const createLinkNode = (
  url = "https://example.com",
  text = "Link",
  options: {
    linkType?: LinkType.CUSTOM | LinkType.INTERNAL
    newTab?: boolean
    doc?: { id: string; slug: string; title: string }
  } = {},
): SerializedLinkNode => ({
  type: NodeType.LINK,
  fields: {
    linkType: options.linkType ?? LinkType.CUSTOM,
    url: options.linkType === LinkType.INTERNAL ? null : url,
    doc: options.linkType === LinkType.INTERNAL && options.doc ? options.doc : undefined,
    newTab: options.newTab ?? false,
  },
  version: 1,
  children: [createTextNode(text)],
})

export const createInvalidLinkNode = (
  text = "Invalid Link",
  fields: Partial<SerializedLinkNode["fields"]> = {},
): SerializedLinkNode => ({
  type: NodeType.LINK,
  fields: fields as SerializedLinkNode["fields"],
  version: 1,
  children: [createTextNode(text)],
})

export const createLinkNodeNoUrl = (text = "No URL Link"): SerializedLinkNode => ({
  type: NodeType.LINK,
  fields: {
    linkType: LinkType.CUSTOM,
    url: null,
    newTab: false,
  },
  version: 1,
  children: [createTextNode(text)],
})

export const createInternalLinkWithInvalidDoc = (
  text = "Invalid Internal Link",
  // biome-ignore lint/suspicious/noExplicitAny: doc is unknown
  doc: any = { id: "123", title: "Invalid Document" },
): SerializedLinkNode => ({
  type: NodeType.LINK,
  fields: {
    linkType: LinkType.INTERNAL,
    doc,
    url: null,
    newTab: false,
  },
  version: 1,
  children: [createTextNode(text)],
})

export const createInternalLinkNoDoc = (text = "No Document Link"): SerializedLinkNode => ({
  type: NodeType.LINK,
  fields: {
    linkType: LinkType.INTERNAL,
    url: null,
    newTab: false,
  },
  version: 1,
  children: [createTextNode(text)],
})

export const createInternalLinkStringDoc = (
  text = "String Document Link",
  doc = "some-document-id",
): SerializedLinkNode => ({
  type: NodeType.LINK,
  fields: {
    linkType: LinkType.INTERNAL,
    doc,
    url: null,
    newTab: false,
  },
  version: 1,
  children: [createTextNode(text)],
})

export const createInternalLinkWithLinkDoc = (
  text = "Internal Link with LinkDoc",
  doc = {
    value: { id: "456", slug: "test-page-link-doc" },
  },
): SerializedLinkNode => ({
  type: NodeType.LINK,
  fields: {
    linkType: LinkType.INTERNAL,
    doc,
    url: null,
    newTab: false,
  },
  version: 1,
  children: [createTextNode(text)],
})

export const createUploadNode = (
  url: string,
  alt: string,
  width: number,
  height: number,
): SerializedUploadNode => ({
  type: NodeType.UPLOAD,
  relationTo: "media",
  value: {
    id: "1",
    url,
    alt,
    width,
    height,
    updatedAt: "2021-01-01",
    createdAt: "2021-01-01",
  },
  version: 1,
})

export const createUploadNodeWithRelation = (
  relationTo = "documents",
  value: SerializedUploadNode["value"] = {
    id: "1",
    url: "/document.pdf",
    alt: "Test",
    updatedAt: "2021-01-01",
    createdAt: "2021-01-01",
  },
): SerializedUploadNode => ({
  type: NodeType.UPLOAD,
  relationTo,
  value,
  version: 1,
})

export const createInvalidUploadNode = (
  value: SerializedUploadNode["value"] = "invalid",
): SerializedUploadNode => ({
  type: NodeType.UPLOAD,
  relationTo: "media",
  value,
  version: 1,
})

export const createUploadNodeWithFilenameOnly = (
  id = "1",
  alt = "No URL Image",
): SerializedUploadNode => ({
  type: NodeType.UPLOAD,
  relationTo: "media",
  value: {
    id,
    alt,
    url: undefined,
    filename: "test.jpg",
    updatedAt: "2021-01-01",
    createdAt: "2021-01-01",
  },
  version: 1,
})

export const createQuoteNode = (text = "Sample quote"): SerializedQuoteNode => ({
  type: NodeType.QUOTE,
  version: 1,
  children: [createTextNode(text)],
})

export const createQuoteNodeCustom = (
  children?: SerializedTextNode[] | undefined,
): SerializedQuoteNode => ({
  type: NodeType.QUOTE,
  version: 1,
  children,
})

export const createListNode = (
  tag: ListType = ListType.UNORDERED,
  items: string[] = ["Item 1", "Item 2"],
): SerializedListNode => ({
  type: NodeType.LIST,
  tag,
  version: 1,
  children: items.map(
    (item): SerializedListItemNode => ({
      type: NodeType.LIST_ITEM,
      version: 1,
      children: [createTextNode(item)],
    }),
  ),
})

export const createListNodeCustom = (
  tag: ListType = ListType.UNORDERED,
  children?: SerializedListItemNode[] | undefined,
): SerializedListNode => ({
  type: NodeType.LIST,
  tag,
  version: 1,
  children,
})

export const createListItemNode = (
  children?: SerializedTextNode[] | undefined,
): SerializedListItemNode => ({
  type: NodeType.LIST_ITEM,
  version: 1,
  children,
})

export const createCodeNode = (
  code = "console.log('Hello World')",
  language?: string,
): SerializedCodeNode => ({
  type: NodeType.CODE,
  language,
  version: 1,
  children: [createTextNode(code)],
})

export const createCodeNodeCustom = (
  children?: SerializedTextNode[] | undefined,
  language?: string,
): SerializedCodeNode => ({
  type: NodeType.CODE,
  language,
  version: 1,
  children,
})

export const createParagraphNodeCustom = (
  children?: SerializedTextNode[] | undefined,
): SerializedParagraphNode => ({
  type: NodeType.PARAGRAPH,
  version: 1,
  children,
})

export const createSimpleTextEditorState = (text: string) =>
  createEditorState([createParagraphNode([createTextNode(text)])])

export const createEmptyRootEditorState = (): SerializedEditorState => ({
  root: {
    children: null as unknown as [],
    direction: "ltr",
    format: "",
    indent: 0,
    type: NodeType.ROOT,
    version: 1,
  },
})

export const plainTextNode = createTextNode("Plain text")
export const boldTextNode = createTextNode("Bold text", TextFormat.BOLD)
export const italicTextNode = createTextNode("Italic text", TextFormat.ITALIC)
export const strikethroughTextNode = createTextNode("Strikethrough text", TextFormat.STRIKETHROUGH)
export const underlineTextNode = createTextNode("Underlined text", TextFormat.UNDERLINE)
export const codeTextNode = createTextNode("Code text", TextFormat.CODE)
export const boldItalicTextNode = createTextNode(
  "Bold and italic",
  TextFormat.BOLD | TextFormat.ITALIC,
)
export const multipleFormatsTextNode = createTextNode(
  "Multiple formats",
  TextFormat.BOLD | TextFormat.ITALIC | TextFormat.STRIKETHROUGH | TextFormat.UNDERLINE,
)
export const strikeUnderlineTextNode = createTextNode(
  "Strike and underline",
  TextFormat.STRIKETHROUGH | TextFormat.UNDERLINE,
)
export const emptyTextNode = createTextNode("")

export const h1HeadingNode = createHeadingNode("h1", "Main Heading")
export const h2HeadingNode = createHeadingNode("h2", "Sub Heading")
export const h6HeadingNode = createHeadingNode("h6", "Small Heading")

export const simpleParagraphNode = createParagraphNode([plainTextNode])
export const mixedFormattingParagraphNode = createParagraphNode([
  createTextNode("This is "),
  boldTextNode,
  createTextNode(" and "),
  italicTextNode,
])
export const emptyParagraphNode = createParagraphNode([])

export const externalLinkNode = createLinkNode("https://example.com", "External Link", {
  newTab: true,
})
export const internalLinkNode = createLinkNode("", "Internal Link", {
  linkType: LinkType.INTERNAL,
  doc: { id: "123", slug: "test-page", title: "Test Page" },
})
export const internalLinkWithLinkDocNode = createInternalLinkWithLinkDoc()
export const invalidLinkNode: SerializedLinkNode = createInvalidLinkNode()

export const imageUploadNode: SerializedUploadNode = createUploadNode(
  "/test-image.jpg",
  "Test Image",
  300,
  200,
)
export const absoluteImageUploadNode = createUploadNode(
  "https://example.com/absolute-image.jpg",
  "Absolute Image",
  300,
  200,
)
export const invalidUploadNode: SerializedUploadNode = createInvalidUploadNode()
export const noUrlUploadNode: SerializedUploadNode = createUploadNodeWithFilenameOnly()

export const simpleQuoteNode = createQuoteNode("This is a quote")
export const emptyQuoteNode = createQuoteNodeCustom([])

export const unorderedListNode = createListNode(ListType.UNORDERED, ["List item 1", "List item 2"])
export const orderedListNode = createListNode(ListType.ORDERED, ["First item", "Second item"])
export const emptyListNode = createListNode(ListType.UNORDERED, [])

export const javascriptCodeNode = createCodeNode("console.log('Hello World')", "javascript")
export const noLanguageCodeNode = createCodeNode("some code")
export const emptyCodeNode = createCodeNode("", "python")

export const lineBreakNode = { type: NodeType.LINE_BREAK as const, version: 1 }
export const horizontalRuleNode = { type: NodeType.HORIZONTAL_RULE as const, version: 1 }

export const createEditorState = (
  children: (
    | SerializedHeadingNode
    | SerializedParagraphNode
    | SerializedTextNode
    | SerializedLinkNode
    | SerializedUploadNode
    | SerializedListNode
    | SerializedListItemNode
    | SerializedQuoteNode
    | SerializedLineBreakNode
    | SerializedCodeNode
    | SerializedHorizontalRuleNode
  )[],
): SerializedEditorState => ({
  root: {
    children,
    direction: "ltr",
    format: "",
    indent: 0,
    type: NodeType.ROOT,
    version: 1,
  },
})

export const basicEditorState = createEditorState([simpleParagraphNode])

export const complexEditorState = createEditorState([
  h1HeadingNode,
  mixedFormattingParagraphNode,
  externalLinkNode,
  imageUploadNode,
  unorderedListNode,
  simpleQuoteNode,
  horizontalRuleNode,
  javascriptCodeNode,
])

export const emptyEditorState = createEditorState([])

export const allFormattingEditorState = createEditorState([
  createHeadingNode("h1", "All Formatting Types"),
  createParagraphNode([
    createTextNode("Normal text, "),
    createTextNode("bold text", TextFormat.BOLD),
    createTextNode(", "),
    createTextNode("italic text", TextFormat.ITALIC),
    createTextNode(", "),
    createTextNode("strikethrough", TextFormat.STRIKETHROUGH),
    createTextNode(", "),
    createTextNode("underlined", TextFormat.UNDERLINE),
    createTextNode(", "),
    createTextNode(
      "bold, strikethrough, underlined, and italic",
      TextFormat.BOLD | TextFormat.STRIKETHROUGH | TextFormat.UNDERLINE | TextFormat.ITALIC,
    ),
    createTextNode(", and "),
    createTextNode("code text", TextFormat.CODE),
    createTextNode("."),
  ]),
  orderedListNode,
])

export const storyBasicData = createEditorState([
  createHeadingNode("h1", "Welcome to UABC"),
  createParagraphNode([
    createTextNode("This is a "),
    createTextNode("sample paragraph", TextFormat.BOLD),
    createTextNode(" with some formatted text."),
  ]),
])

export const storyComplexData = createEditorState([
  createHeadingNode("h2", "FAQ Section"),
  createParagraphNode([
    createTextNode("Here's some content with a "),
    createLinkNode("https://example.com", "custom link", { newTab: true }),
    createTextNode(" and some "),
    createTextNode("italic text", TextFormat.ITALIC),
    createTextNode("."),
  ]),
  createListNode(ListType.UNORDERED, ["First list item", "Second list item with code"]),
  createQuoteNode("This is a blockquote with some inspirational text."),
  horizontalRuleNode,
  createParagraphNode([
    createTextNode("Contact us at "),
    createLinkNode("mailto:info@uabc.co.nz", "info@uabc.co.nz"),
  ]),
])
