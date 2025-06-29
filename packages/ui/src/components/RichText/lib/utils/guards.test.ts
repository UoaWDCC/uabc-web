import {
  hasChildren,
  isCodeNode,
  isDocumentWithSlug,
  isHeadingNode,
  isHorizontalRuleNode,
  isLineBreakNode,
  isLinkDocument,
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

describe("guards", () => {
  describe("isQuoteNode", () => {
    it("should return true for a valid quote node", () => {
      const node = {
        type: "quote",
        version: 1,
        children: [],
      }
      expect(isQuoteNode(node)).toBe(true)
    })

    it("should return false for an invalid node", () => {
      const node = { type: "text", text: "test", version: 1 }
      expect(isQuoteNode(node)).toBe(false)
    })
  })

  describe("isListNode", () => {
    it("should return true for a valid list node", () => {
      const node = {
        type: "list",
        version: 1,
        children: [],
        tag: "ul",
      }
      expect(isListNode(node)).toBe(true)
    })

    it("should return false for an invalid node", () => {
      const node = { type: "text", text: "test", version: 1 }
      expect(isListNode(node)).toBe(false)
    })
  })

  describe("isListItemNode", () => {
    it("should return true for a valid list item node", () => {
      const node = {
        type: "listitem",
        version: 1,
        children: [],
      }
      expect(isListItemNode(node)).toBe(true)
    })

    it("should return false for an invalid node", () => {
      const node = { type: "text", text: "test", version: 1 }
      expect(isListItemNode(node)).toBe(false)
    })
  })

  describe("isLineBreakNode", () => {
    it("should return true for a valid line break node", () => {
      const node = { type: "linebreak", version: 1 }
      expect(isLineBreakNode(node)).toBe(true)
    })

    it("should return false for an invalid node", () => {
      const node = { type: "text", text: "test", version: 1 }
      expect(isLineBreakNode(node)).toBe(false)
    })
  })

  describe("isHorizontalRuleNode", () => {
    it("should return true for a valid horizontal rule node", () => {
      const node = { type: "horizontalrule", version: 1 }
      expect(isHorizontalRuleNode(node)).toBe(true)
    })

    it("should return false for an invalid node", () => {
      const node = { type: "text", text: "test", version: 1 }
      expect(isHorizontalRuleNode(node)).toBe(false)
    })
  })

  describe("isCodeNode", () => {
    it("should return true for a valid code node", () => {
      const node = {
        type: "code",
        version: 1,
        children: [],
        language: "javascript",
      }
      expect(isCodeNode(node)).toBe(true)
    })

    it("should return false for an invalid node", () => {
      const node = { type: "text", text: "test", version: 1 }
      expect(isCodeNode(node)).toBe(false)
    })
  })

  describe("isMediaDocument", () => {
    it("should return true for a valid media document", () => {
      const doc = { id: "1", filename: "image.jpg", mimeType: "image/jpeg" }
      expect(isMediaDocument(doc)).toBe(true)
    })

    it("should return false for an invalid document", () => {
      const doc = { id: "1" }
      expect(isMediaDocument(doc)).toBe(false)
    })
  })

  describe("isDocumentWithSlug", () => {
    it("should return true for a valid document with slug", () => {
      const doc = { id: "1", slug: "my-doc" }
      expect(isDocumentWithSlug(doc)).toBe(true)
    })

    it("should return false for an invalid document", () => {
      const doc = { id: "1" }
      expect(isDocumentWithSlug(doc)).toBe(false)
    })
  })

  describe("isLinkDocument", () => {
    it("should return true for a valid link document", () => {
      const doc = { relationTo: "pages", value: { id: "1", slug: "a-page" } }
      expect(isLinkDocument(doc)).toBe(true)
    })

    it("should return false for an invalid document", () => {
      const doc = { relationTo: "pages" }
      expect(isLinkDocument(doc)).toBe(false)
    })
  })

  describe("isValidLinkFields", () => {
    it("should return true for valid link fields", () => {
      const fields = {
        doc: { relationTo: "pages", value: { id: "1", slug: "a-page" } },
        linkType: "internal",
      }
      expect(isValidLinkFields(fields)).toBe(true)
    })

    it("should return false for invalid link fields", () => {
      const fields = { linkType: "internal" }
      expect(isValidLinkFields(fields)).toBe(false)
    })
  })

  describe("isTextNode", () => {
    it("should return true for a valid text node", () => {
      const node = { type: "text", text: "hello", version: 1 }
      expect(isTextNode(node)).toBe(true)
    })

    it("should return false for an invalid node", () => {
      const node = { type: "paragraph", version: 1 }
      expect(isTextNode(node)).toBe(false)
    })
  })

  describe("isHeadingNode", () => {
    it("should return true for a valid heading node", () => {
      const node = { type: "heading", tag: "h1", children: [], version: 1 }
      expect(isHeadingNode(node)).toBe(true)
    })

    it("should return false for an invalid node", () => {
      const node = { type: "paragraph", version: 1 }
      expect(isHeadingNode(node)).toBe(false)
    })
  })

  describe("isLinkNode", () => {
    it("should return true for a valid link node", () => {
      const node = {
        type: "link",
        version: 1,
        children: [],
        fields: {
          doc: { relationTo: "pages", value: { id: "1", slug: "a-page" } },
          linkType: "internal",
        },
      }
      expect(isLinkNode(node)).toBe(true)
    })

    it("should return false for an invalid node", () => {
      const node = { type: "paragraph", version: 1 }
      expect(isLinkNode(node)).toBe(false)
    })
  })

  describe("isUploadNode", () => {
    it("should return true for a valid upload node", () => {
      const node = {
        type: "upload",
        version: 1,
        relationTo: "media",
        value: { id: "1", filename: "image.jpg", mimeType: "image/jpeg" },
      }
      expect(isUploadNode(node)).toBe(true)
    })

    it("should return false for an invalid node", () => {
      const node = { type: "paragraph", version: 1 }
      expect(isUploadNode(node)).toBe(false)
    })
  })

  describe("isParagraphNode", () => {
    it("should return true for a valid paragraph node", () => {
      const node = { type: "paragraph", children: [], version: 1 }
      expect(isParagraphNode(node)).toBe(true)
    })

    it("should return false for an invalid node", () => {
      const node = { type: "text", text: "hello", version: 1 }
      expect(isParagraphNode(node)).toBe(false)
    })
  })

  describe("hasChildren", () => {
    it("should return true for a node with children", () => {
      const node = { type: "paragraph", children: [], version: 1 }
      expect(hasChildren(node)).toBe(true)
    })

    it("should return false for a node without children", () => {
      const node = { type: "text", text: "hello", version: 1 }
      expect(hasChildren(node)).toBe(false)
    })
  })
})
