import { TextFormat } from "@/components/RichTextRenderer/lib/constants"
import type {
  SerializedCodeNode,
  SerializedEditorState,
  SerializedHeadingNode,
  SerializedLinkNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedParagraphNode,
  SerializedQuoteNode,
  SerializedTextNode,
  SerializedUploadNode,
} from "@/components/RichTextRenderer/lib/types"

// Basic Text Node Mocks
export const plainTextNode: SerializedTextNode = {
  type: "text",
  text: "Plain text",
  version: 1,
}

export const boldTextNode: SerializedTextNode = {
  type: "text",
  text: "Bold text",
  format: TextFormat.BOLD,
  version: 1,
}

export const italicTextNode: SerializedTextNode = {
  type: "text",
  text: "Italic text",
  format: TextFormat.ITALIC,
  version: 1,
}

export const strikethroughTextNode: SerializedTextNode = {
  type: "text",
  text: "Strikethrough text",
  format: TextFormat.STRIKETHROUGH,
  version: 1,
}

export const underlineTextNode: SerializedTextNode = {
  type: "text",
  text: "Underlined text",
  format: TextFormat.UNDERLINE,
  version: 1,
}

export const codeTextNode: SerializedTextNode = {
  type: "text",
  text: "Code text",
  format: TextFormat.CODE,
  version: 1,
}

// Combined Formatting Text Nodes
export const boldItalicTextNode: SerializedTextNode = {
  type: "text",
  text: "Bold and italic",
  format: TextFormat.BOLD | TextFormat.ITALIC,
  version: 1,
}

export const multipleFormatsTextNode: SerializedTextNode = {
  type: "text",
  text: "Multiple formats",
  format: TextFormat.BOLD | TextFormat.ITALIC | TextFormat.STRIKETHROUGH | TextFormat.UNDERLINE,
  version: 1,
}

export const strikeUnderlineTextNode: SerializedTextNode = {
  type: "text",
  text: "Strike and underline",
  format: TextFormat.STRIKETHROUGH | TextFormat.UNDERLINE,
  version: 1,
}

export const emptyTextNode: SerializedTextNode = {
  type: "text",
  text: "",
  version: 1,
}

// Heading Node Mocks
export const h1HeadingNode: SerializedHeadingNode = {
  type: "heading",
  tag: "h1",
  version: 1,
  children: [
    {
      type: "text",
      text: "Main Heading",
      version: 1,
    } as SerializedTextNode,
  ],
}

export const h2HeadingNode: SerializedHeadingNode = {
  type: "heading",
  tag: "h2",
  version: 1,
  children: [
    {
      type: "text",
      text: "Sub Heading",
      version: 1,
    } as SerializedTextNode,
  ],
}

export const h6HeadingNode: SerializedHeadingNode = {
  type: "heading",
  tag: "h6",
  version: 1,
  children: [
    {
      type: "text",
      text: "Small Heading",
      version: 1,
    } as SerializedTextNode,
  ],
}

// Paragraph Node Mocks
export const simpleParagraphNode: SerializedParagraphNode = {
  type: "paragraph",
  version: 1,
  children: [plainTextNode],
}

export const mixedFormattingParagraphNode: SerializedParagraphNode = {
  type: "paragraph",
  version: 1,
  children: [
    {
      type: "text",
      text: "This is ",
      version: 1,
    },
    boldTextNode,
    {
      type: "text",
      text: " and ",
      version: 1,
    },
    italicTextNode,
  ] as SerializedTextNode[],
}

export const emptyParagraphNode: SerializedParagraphNode = {
  type: "paragraph",
  version: 1,
  children: [],
}

// Link Node Mocks
export const externalLinkNode: SerializedLinkNode = {
  type: "link",
  fields: {
    linkType: "custom",
    url: "https://example.com",
    newTab: true,
  },
  version: 1,
  children: [
    {
      type: "text",
      text: "External Link",
      version: 1,
    } as SerializedTextNode,
  ],
}

export const internalLinkNode: SerializedLinkNode = {
  type: "link",
  fields: {
    linkType: "internal",
    doc: {
      id: "123",
      slug: "test-page",
      title: "Test Page",
    },
    newTab: false,
  },
  version: 1,
  children: [
    {
      type: "text",
      text: "Internal Link",
      version: 1,
    } as SerializedTextNode,
  ],
}

export const invalidLinkNode: SerializedLinkNode = {
  type: "link",
  fields: {} as SerializedLinkNode["fields"],
  version: 1,
  children: [
    {
      type: "text",
      text: "Invalid Link",
      version: 1,
    } as SerializedTextNode,
  ],
}

// Upload/Image Node Mocks
export const imageUploadNode: SerializedUploadNode = {
  type: "upload",
  relationTo: "media",
  value: {
    id: "1",
    url: "/test-image.jpg",
    alt: "Test Image",
    width: 300,
    height: 200,
  },
  version: 1,
}

export const relativeImageUploadNode: SerializedUploadNode = {
  type: "upload",
  relationTo: "media",
  value: {
    id: "1",
    url: "/relative-image.jpg",
    alt: "Relative Image",
    width: 300,
    height: 200,
  },
  version: 1,
}

export const absoluteImageUploadNode: SerializedUploadNode = {
  type: "upload",
  relationTo: "media",
  value: {
    id: "1",
    url: "https://example.com/absolute-image.jpg",
    alt: "Absolute Image",
    width: 300,
    height: 200,
  },
  version: 1,
}

export const invalidUploadNode: SerializedUploadNode = {
  type: "upload",
  relationTo: "media",
  value: "invalid",
  version: 1,
}

export const noUrlUploadNode: SerializedUploadNode = {
  type: "upload",
  relationTo: "media",
  value: {
    id: "1",
    alt: "No URL Image",
  },
  version: 1,
}

// Quote Node Mocks
export const simpleQuoteNode: SerializedQuoteNode = {
  type: "quote",
  version: 1,
  children: [
    {
      type: "text",
      text: "This is a quote",
      version: 1,
    } as SerializedTextNode,
  ],
}

export const emptyQuoteNode: SerializedQuoteNode = {
  type: "quote",
  version: 1,
  children: [],
}

// List Node Mocks
export const unorderedListNode: SerializedListNode = {
  type: "list",
  tag: "ul",
  version: 1,
  children: [
    {
      type: "listitem",
      version: 1,
      children: [
        {
          type: "text",
          text: "List item 1",
          version: 1,
        } as SerializedTextNode,
      ],
    } as SerializedListItemNode,
    {
      type: "listitem",
      version: 1,
      children: [
        {
          type: "text",
          text: "List item 2",
          version: 1,
        } as SerializedTextNode,
      ],
    } as SerializedListItemNode,
  ],
}

export const orderedListNode: SerializedListNode = {
  type: "list",
  tag: "ol",
  version: 1,
  children: [
    {
      type: "listitem",
      version: 1,
      children: [
        {
          type: "text",
          text: "First item",
          version: 1,
        } as SerializedTextNode,
      ],
    } as SerializedListItemNode,
    {
      type: "listitem",
      version: 1,
      children: [
        {
          type: "text",
          text: "Second item",
          version: 1,
        } as SerializedTextNode,
      ],
    } as SerializedListItemNode,
  ],
}

export const emptyListNode: SerializedListNode = {
  type: "list",
  tag: "ul",
  version: 1,
  children: [],
}

// Code Node Mocks
export const javascriptCodeNode: SerializedCodeNode = {
  type: "code",
  language: "javascript",
  version: 1,
  children: [
    {
      type: "text",
      text: "console.log('Hello World')",
      version: 1,
    } as SerializedTextNode,
  ],
}

export const noLanguageCodeNode: SerializedCodeNode = {
  type: "code",
  version: 1,
  children: [
    {
      type: "text",
      text: "some code",
      version: 1,
    } as SerializedTextNode,
  ],
}

export const emptyCodeNode: SerializedCodeNode = {
  type: "code",
  language: "python",
  version: 1,
  children: [],
}

// Special Nodes
export const lineBreakNode = {
  type: "linebreak",
  version: 1,
}

export const horizontalRuleNode = {
  type: "horizontalrule",
  version: 1,
}

// Complete Editor State Mocks
export const basicEditorState: SerializedEditorState = {
  root: {
    children: [simpleParagraphNode],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
}

export const complexEditorState: SerializedEditorState = {
  root: {
    children: [
      h1HeadingNode,
      mixedFormattingParagraphNode,
      externalLinkNode,
      imageUploadNode,
      unorderedListNode,
      simpleQuoteNode,
      horizontalRuleNode,
      javascriptCodeNode,
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
}

export const emptyEditorState: SerializedEditorState = {
  root: {
    children: [],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
}

export const allFormattingEditorState: SerializedEditorState = {
  root: {
    children: [
      {
        type: "heading",
        tag: "h1",
        version: 1,
        children: [
          { type: "text", text: "All Formatting Types", version: 1 } as SerializedTextNode,
        ],
      } as SerializedHeadingNode,
      {
        type: "paragraph",
        version: 1,
        children: [
          { type: "text", text: "Normal text, ", version: 1 } as SerializedTextNode,
          {
            type: "text",
            text: "bold text",
            format: TextFormat.BOLD,
            version: 1,
          } as SerializedTextNode,
          { type: "text", text: ", ", version: 1 } as SerializedTextNode,
          {
            type: "text",
            text: "italic text",
            format: TextFormat.ITALIC,
            version: 1,
          } as SerializedTextNode,
          { type: "text", text: ", ", version: 1 } as SerializedTextNode,
          {
            type: "text",
            text: "strikethrough",
            format: TextFormat.STRIKETHROUGH,
            version: 1,
          } as SerializedTextNode,
          { type: "text", text: ", ", version: 1 } as SerializedTextNode,
          {
            type: "text",
            text: "underlined",
            format: TextFormat.UNDERLINE,
            version: 1,
          } as SerializedTextNode,
          { type: "text", text: ", and ", version: 1 } as SerializedTextNode,
          {
            type: "text",
            text: "code text",
            format: TextFormat.CODE,
            version: 1,
          } as SerializedTextNode,
          { type: "text", text: ".", version: 1 } as SerializedTextNode,
        ],
      } as SerializedParagraphNode,
      orderedListNode,
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
}

// Story-specific mocks for Storybook
export const storyBasicData: SerializedEditorState = {
  root: {
    children: [
      {
        type: "heading",
        tag: "h1",
        version: 1,
        children: [
          {
            type: "text",
            text: "Welcome to UABC",
            version: 1,
          } as SerializedTextNode,
        ],
      } as SerializedHeadingNode,
      {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            text: "This is a ",
            version: 1,
          } as SerializedTextNode,
          {
            type: "text",
            text: "sample paragraph",
            format: TextFormat.BOLD,
            version: 1,
          } as SerializedTextNode,
          {
            type: "text",
            text: " with some formatted text.",
            version: 1,
          } as SerializedTextNode,
        ],
      } as SerializedParagraphNode,
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
}

export const storyComplexData: SerializedEditorState = {
  root: {
    children: [
      {
        type: "heading",
        tag: "h2",
        version: 1,
        children: [
          {
            type: "text",
            text: "FAQ Section",
            version: 1,
          } as SerializedTextNode,
        ],
      } as SerializedHeadingNode,
      {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            text: "Here's some content with a ",
            version: 1,
          } as SerializedTextNode,
          {
            type: "link",
            fields: {
              linkType: "custom",
              url: "https://example.com",
              newTab: true,
            },
            version: 1,
            children: [
              {
                type: "text",
                text: "custom link",
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedLinkNode,
          {
            type: "text",
            text: " and some ",
            version: 1,
          } as SerializedTextNode,
          {
            type: "text",
            text: "italic text",
            format: TextFormat.ITALIC,
            version: 1,
          } as SerializedTextNode,
          {
            type: "text",
            text: ".",
            version: 1,
          } as SerializedTextNode,
        ],
      } as SerializedParagraphNode,
      {
        type: "list",
        tag: "ul",
        version: 1,
        children: [
          {
            type: "listitem",
            version: 1,
            children: [
              {
                type: "text",
                text: "First list item",
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedListItemNode,
          {
            type: "listitem",
            version: 1,
            children: [
              {
                type: "text",
                text: "Second list item with ",
                version: 1,
              } as SerializedTextNode,
              {
                type: "text",
                text: "code",
                format: TextFormat.CODE,
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedListItemNode,
        ],
      } as SerializedListNode,
      {
        type: "quote",
        version: 1,
        children: [
          {
            type: "text",
            text: "This is a blockquote with some inspirational text.",
            format: TextFormat.ITALIC,
            version: 1,
          } as SerializedTextNode,
        ],
      } as SerializedQuoteNode,
      horizontalRuleNode,
      {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            text: "Contact us at ",
            version: 1,
          } as SerializedTextNode,
          {
            type: "link",
            fields: {
              linkType: "custom",
              url: "mailto:info@uabc.co.nz",
            },
            version: 1,
            children: [
              {
                type: "text",
                text: "info@uabc.co.nz",
                format: TextFormat.CODE,
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedLinkNode,
        ],
      } as SerializedParagraphNode,
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
}
