import {
  boldTextNode,
  createTextNode,
  emptyParagraphNode,
  h1HeadingNode,
  horizontalRuleNode,
  javascriptCodeNode,
  lineBreakNode,
  plainTextNode,
  simpleParagraphNode,
  simpleQuoteNode,
  unorderedListNode,
} from "@/test-config/RichTextRenderer.mock"
import { LinkType, ListType, NodeType } from "../constants"
import { DocumentWithSlugSchema, LinkFieldsSchema, MediaDocumentSchema } from "../schemas"
import type {
  SerializedCodeNode,
  SerializedHeadingNode,
  SerializedLexicalNode,
  SerializedLinkNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedNodeWithChildren,
  SerializedTextNode,
  SerializedUploadNode,
} from "../types"
import {
  hasChildren,
  isCodeNode,
  isDocumentWithSlug,
  isHeadingNode,
  isHorizontalRuleNode,
  isLineBreakNode,
  isLinkNode,
  isListItemNode,
  isListNode,
  isMediaDocument,
  isParagraphNode,
  isQuoteNode,
  isTextNode,
  isUploadNode,
  isValidLinkFields,
} from "./guards"

describe("Type Guards", () => {
  describe("isMediaDocument", () => {
    it("returns true for valid media document", () => {
      const validMedia = {
        id: "123",
        url: "/test.jpg",
        alt: "Test image",
        width: 300,
        height: 200,
        filename: "test.jpg",
        mimeType: "image/jpeg",
        filesize: 12345,
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01",
      }

      expect(isMediaDocument(validMedia)).toBe(true)
    })

    it("returns true for minimal valid media document", () => {
      const minimalMedia = {
        url: "/test.jpg",
      }

      expect(isMediaDocument(minimalMedia)).toBe(true)
    })

    it("returns false for invalid media document", () => {
      expect(isMediaDocument(null)).toBe(false)
      expect(isMediaDocument(undefined)).toBe(false)
      expect(isMediaDocument({})).toBe(false)
      expect(isMediaDocument("string")).toBe(false)
      expect(isMediaDocument({ id: "123" })).toBe(false) // Missing url
    })

    it("returns false for media document with invalid url type", () => {
      const invalidMedia = {
        url: 123, // Should be string
      }

      expect(isMediaDocument(invalidMedia)).toBe(false)
    })
  })

  describe("isDocumentWithSlug", () => {
    it("returns true for valid document with slug", () => {
      const validDoc = {
        id: "123",
        slug: "test-page",
        title: "Test Page",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01",
      }

      expect(isDocumentWithSlug(validDoc)).toBe(true)
    })

    it("returns true for minimal valid document", () => {
      const minimalDoc = {
        slug: "test-page",
      }

      expect(isDocumentWithSlug(minimalDoc)).toBe(true)
    })

    it("returns false for invalid document", () => {
      expect(isDocumentWithSlug(null)).toBe(false)
      expect(isDocumentWithSlug(undefined)).toBe(false)
      expect(isDocumentWithSlug({})).toBe(false)
      expect(isDocumentWithSlug("string")).toBe(false)
      expect(isDocumentWithSlug({ id: "123" })).toBe(false) // Missing slug
    })

    it("returns false for document with invalid slug type", () => {
      const invalidDoc = {
        slug: 123, // Should be string
      }

      expect(isDocumentWithSlug(invalidDoc)).toBe(false)
    })
  })

  describe("isValidLinkFields", () => {
    it("returns true for valid custom link fields", () => {
      const validCustomLink = {
        linkType: "custom" as const,
        url: "https://example.com",
        newTab: true,
      }

      expect(isValidLinkFields(validCustomLink)).toBe(true)
    })

    it("returns true for valid internal link fields", () => {
      const validInternalLink = {
        linkType: "internal" as const,
        doc: {
          slug: "test-page",
        },
        newTab: false,
      }

      expect(isValidLinkFields(validInternalLink)).toBe(true)
    })

    it("returns true for minimal valid link fields", () => {
      const minimalLink = {
        linkType: "custom" as const,
      }

      expect(isValidLinkFields(minimalLink)).toBe(true)
    })

    it("returns false for invalid link fields", () => {
      expect(isValidLinkFields(null)).toBe(false)
      expect(isValidLinkFields(undefined)).toBe(false)
      expect(isValidLinkFields({})).toBe(false)
      expect(isValidLinkFields("string")).toBe(false)
      expect(isValidLinkFields({ url: "test" })).toBe(false) // Missing linkType
    })

    it("returns false for invalid linkType", () => {
      const invalidLinkType = {
        linkType: "invalid",
      }

      expect(isValidLinkFields(invalidLinkType)).toBe(false)
    })
  })

  describe("isTextNode", () => {
    it("returns true for valid text node", () => {
      expect(isTextNode(plainTextNode)).toBe(true)
    })

    it("returns true for text node with format", () => {
      expect(isTextNode(boldTextNode)).toBe(true)
    })

    it("returns false for non-text node", () => {
      expect(isTextNode(h1HeadingNode)).toBe(false)
    })

    it("returns false for invalid node", () => {
      const invalidNode: Partial<SerializedTextNode> = {
        type: NodeType.TEXT,
        version: 1,
      }

      expect(isTextNode(invalidNode as unknown as SerializedTextNode)).toBe(false)
    })
  })

  describe("isHeadingNode", () => {
    it("returns true for valid heading node", () => {
      expect(isHeadingNode(h1HeadingNode)).toBe(true)
    })

    it("returns false for non-heading node", () => {
      expect(isHeadingNode(plainTextNode)).toBe(false)
    })

    it("returns false for heading node missing tag", () => {
      const invalidNode: Partial<SerializedHeadingNode> = {
        type: NodeType.HEADING,
        children: [],
        version: 1,
      }

      expect(isHeadingNode(invalidNode as unknown as SerializedHeadingNode)).toBe(false)
    })

    it("returns false for heading node missing children", () => {
      const invalidNode: Partial<SerializedHeadingNode> = {
        type: NodeType.HEADING,
        tag: "h1",
        version: 1,
      }

      expect(isHeadingNode(invalidNode as unknown as SerializedHeadingNode)).toBe(false)
    })
  })

  describe("isLinkNode", () => {
    it("returns true for valid link node", () => {
      const linkNode: SerializedLinkNode = {
        type: NodeType.LINK,
        fields: {
          linkType: LinkType.CUSTOM,
          url: "https://example.com",
        },
        children: [],
        version: 1,
      }

      expect(isLinkNode(linkNode)).toBe(true)
    })

    it("returns false for non-link node", () => {
      const textNode: SerializedTextNode = {
        type: NodeType.TEXT,
        text: "Hello",
        version: 1,
      }

      expect(isLinkNode(textNode)).toBe(false)
    })

    it("returns false for link node missing fields", () => {
      const invalidNode: Partial<SerializedLinkNode> = {
        type: NodeType.LINK,
        children: [],
        version: 1,
      }

      expect(isLinkNode(invalidNode as unknown as SerializedLinkNode)).toBe(false)
    })
  })

  describe("isUploadNode", () => {
    it("returns true for valid upload node", () => {
      const uploadNode: SerializedUploadNode = {
        type: NodeType.UPLOAD,
        relationTo: "media",
        value: { url: "/test.jpg" },
        version: 1,
      }

      expect(isUploadNode(uploadNode)).toBe(true)
    })

    it("returns false for non-upload node", () => {
      const textNode: SerializedTextNode = {
        type: NodeType.TEXT,
        text: "Hello",
        version: 1,
      }

      expect(isUploadNode(textNode)).toBe(false)
    })

    it("returns false for upload node missing relationTo", () => {
      const invalidNode: Partial<SerializedUploadNode> = {
        type: NodeType.UPLOAD,
        value: { url: "/test.jpg" },
        version: 1,
      }

      expect(isUploadNode(invalidNode as unknown as SerializedUploadNode)).toBe(false)
    })
  })

  describe("isParagraphNode", () => {
    it("returns true for valid paragraph node", () => {
      expect(isParagraphNode(simpleParagraphNode)).toBe(true)
    })

    it("returns true for paragraph node without children", () => {
      expect(isParagraphNode(emptyParagraphNode)).toBe(true)
    })

    it("returns false for non-paragraph node", () => {
      expect(isParagraphNode(plainTextNode)).toBe(false)
    })
  })

  describe("isQuoteNode", () => {
    it("returns true for valid quote node", () => {
      expect(isQuoteNode(simpleQuoteNode)).toBe(true)
    })

    it("returns false for non-quote node", () => {
      expect(isQuoteNode(plainTextNode)).toBe(false)
    })
  })

  describe("isListNode", () => {
    it("returns true for valid unordered list node", () => {
      expect(isListNode(unorderedListNode)).toBe(true)
    })

    it("returns true for valid ordered list node", () => {
      const listNode: SerializedListNode = {
        type: NodeType.LIST,
        tag: ListType.ORDERED,
        children: [],
        version: 1,
      }

      expect(isListNode(listNode)).toBe(true)
    })

    it("returns false for non-list node", () => {
      expect(isListNode(plainTextNode)).toBe(false)
    })

    it("returns false for list node missing tag", () => {
      const invalidNode: Partial<SerializedListNode> = {
        type: NodeType.LIST,
        children: [],
        version: 1,
      }

      expect(isListNode(invalidNode as unknown as SerializedListNode)).toBe(false)
    })
  })

  describe("isListItemNode", () => {
    it("returns true for valid list item node", () => {
      const listItemNode: SerializedListItemNode = {
        type: NodeType.LIST_ITEM,
        children: [],
        version: 1,
      }

      expect(isListItemNode(listItemNode)).toBe(true)
    })

    it("returns false for non-list item node", () => {
      const textNode: SerializedTextNode = {
        type: NodeType.TEXT,
        text: "Hello",
        version: 1,
      }

      expect(isListItemNode(textNode)).toBe(false)
    })
  })

  describe("isLineBreakNode", () => {
    it("returns true for valid line break node", () => {
      expect(isLineBreakNode(lineBreakNode)).toBe(true)
    })

    it("returns false for non-line break node", () => {
      expect(isLineBreakNode(plainTextNode)).toBe(false)
    })
  })

  describe("isHorizontalRuleNode", () => {
    it("returns true for valid horizontal rule node", () => {
      expect(isHorizontalRuleNode(horizontalRuleNode)).toBe(true)
    })

    it("returns false for non-horizontal rule node", () => {
      expect(isHorizontalRuleNode(plainTextNode)).toBe(false)
    })
  })

  describe("isCodeNode", () => {
    it("returns true for valid code node", () => {
      expect(isCodeNode(javascriptCodeNode)).toBe(true)
    })

    it("returns true for code node without language", () => {
      const codeNode: SerializedCodeNode = {
        type: NodeType.CODE,
        children: [],
        version: 1,
      }

      expect(isCodeNode(codeNode)).toBe(true)
    })

    it("returns false for non-code node", () => {
      expect(isCodeNode(plainTextNode)).toBe(false)
    })
  })

  describe("hasChildren", () => {
    it("returns true for node with children array", () => {
      const nodeWithChildren: SerializedNodeWithChildren = {
        type: NodeType.PARAGRAPH,
        children: [createTextNode("Hello")],
        version: 1,
      }

      expect(hasChildren(nodeWithChildren)).toBe(true)
    })

    it("returns true for node with empty children array", () => {
      expect(hasChildren(emptyParagraphNode)).toBe(true)
    })

    it("returns false for node without children", () => {
      expect(hasChildren(lineBreakNode)).toBe(false)
    })

    it("returns false for node with non-array children", () => {
      const nodeWithInvalidChildren: Partial<SerializedNodeWithChildren> = {
        type: NodeType.PARAGRAPH,
        children: "not an array" as unknown as SerializedLexicalNode[],
        version: 1,
      }

      expect(hasChildren(nodeWithInvalidChildren as unknown as SerializedNodeWithChildren)).toBe(
        false,
      )
    })

    it("returns false for node with null children", () => {
      const nodeWithNullChildren: Partial<SerializedNodeWithChildren> = {
        type: NodeType.PARAGRAPH,
        children: null as unknown as SerializedLexicalNode[],
        version: 1,
      }

      expect(hasChildren(nodeWithNullChildren as unknown as SerializedNodeWithChildren)).toBe(false)
    })

    it("returns false for node with undefined children", () => {
      const nodeWithUndefinedChildren: Partial<SerializedNodeWithChildren> = {
        type: NodeType.PARAGRAPH,
        children: undefined,
        version: 1,
      }

      expect(hasChildren(nodeWithUndefinedChildren as unknown as SerializedNodeWithChildren)).toBe(
        false,
      )
    })
  })

  describe("Schema validation", () => {
    it("MediaDocumentSchema validates correctly", () => {
      const validMedia = {
        url: "/test.jpg",
        alt: "Test image",
      }

      const result = MediaDocumentSchema.safeParse(validMedia)
      expect(result.success).toBe(true)
    })

    it("DocumentWithSlugSchema validates correctly", () => {
      const validDoc = {
        slug: "test-page",
        title: "Test Page",
      }

      const result = DocumentWithSlugSchema.safeParse(validDoc)
      expect(result.success).toBe(true)
    })

    it("LinkFieldsSchema validates correctly", () => {
      const validLink = {
        linkType: LinkType.CUSTOM,
        url: "https://example.com",
      }

      const result = LinkFieldsSchema.safeParse(validLink)
      expect(result.success).toBe(true)
    })
  })
})
