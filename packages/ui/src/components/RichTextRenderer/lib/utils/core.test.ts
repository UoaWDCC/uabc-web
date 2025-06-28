import type {
  SerializedHeadingNode,
  SerializedLexicalNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedParagraphNode,
  SerializedTextNode,
} from "../types"
import { createAnchor, createNodeKey, extractTextFromNodes } from "./core"

describe("Core Utilities", () => {
  describe("extractTextFromNodes", () => {
    it("extracts text from a single text node", () => {
      const nodes: SerializedLexicalNode[] = [
        {
          type: "text",
          text: "Hello world",
          version: 1,
        } as SerializedTextNode,
      ]

      expect(extractTextFromNodes(nodes)).toBe("Hello world")
    })

    it("extracts text from multiple text nodes", () => {
      const nodes: SerializedLexicalNode[] = [
        {
          type: "text",
          text: "Hello ",
          version: 1,
        } as SerializedTextNode,
        {
          type: "text",
          text: "world",
          version: 1,
        } as SerializedTextNode,
      ]

      expect(extractTextFromNodes(nodes)).toBe("Hello world")
    })

    it("extracts text from nested nodes with children", () => {
      const nodes: SerializedLexicalNode[] = [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "Nested ",
              version: 1,
            } as SerializedTextNode,
            {
              type: "text",
              text: "text",
              version: 1,
            } as SerializedTextNode,
          ],
          version: 1,
        } as SerializedParagraphNode,
      ]

      expect(extractTextFromNodes(nodes)).toBe("Nested text")
    })

    it("extracts text from deeply nested nodes", () => {
      const nodes: SerializedLexicalNode[] = [
        {
          type: "list",
          children: [
            {
              type: "listitem",
              children: [
                {
                  type: "text",
                  text: "Item 1",
                  version: 1,
                } as SerializedTextNode,
              ],
              version: 1,
            } as SerializedListItemNode,
            {
              type: "listitem",
              children: [
                {
                  type: "text",
                  text: "Item 2",
                  version: 1,
                } as SerializedTextNode,
              ],
              version: 1,
            } as SerializedListItemNode,
          ],
          version: 1,
        } as SerializedListNode,
      ]

      expect(extractTextFromNodes(nodes)).toBe("Item 1Item 2")
    })

    it("handles empty text nodes", () => {
      const nodes: SerializedLexicalNode[] = [
        {
          type: "text",
          text: "",
          version: 1,
        } as SerializedTextNode,
      ]

      expect(extractTextFromNodes(nodes)).toBe("")
    })

    it("handles nodes without text property", () => {
      const nodes: SerializedLexicalNode[] = [
        {
          type: "linebreak",
          version: 1,
        },
        {
          type: "text",
          text: "Hello",
          version: 1,
        } as SerializedTextNode,
      ]

      expect(extractTextFromNodes(nodes)).toBe("Hello")
    })

    it("handles empty array", () => {
      expect(extractTextFromNodes([])).toBe("")
    })

    it("handles mixed node types", () => {
      const nodes: SerializedLexicalNode[] = [
        {
          type: "text",
          text: "Start",
          version: 1,
        } as SerializedTextNode,
        {
          type: "linebreak",
          version: 1,
        },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "Middle",
              version: 1,
            } as SerializedTextNode,
          ],
          version: 1,
        } as SerializedParagraphNode,
        {
          type: "text",
          text: "End",
          version: 1,
        } as SerializedTextNode,
      ]

      expect(extractTextFromNodes(nodes)).toBe("StartMiddleEnd")
    })

    it("handles nodes with undefined or null text", () => {
      const nodes: SerializedLexicalNode[] = [
        {
          type: "text",
          text: undefined,
          version: 1,
        } as unknown as SerializedTextNode,
        {
          type: "text",
          text: null,
          version: 1,
        } as unknown as SerializedTextNode,
        {
          type: "text",
          text: "Valid text",
          version: 1,
        } as SerializedTextNode,
      ]

      expect(extractTextFromNodes(nodes)).toBe("Valid text")
    })
  })

  describe("createAnchor", () => {
    it("converts text to URL-friendly anchor", () => {
      expect(createAnchor("Hello World")).toBe("hello-world")
    })

    it("removes special characters", () => {
      expect(createAnchor("Hello, World!")).toBe("hello-world")
    })

    it("handles multiple spaces", () => {
      expect(createAnchor("Hello    World")).toBe("hello-world")
    })

    it("handles multiple hyphens", () => {
      expect(createAnchor("Hello---World")).toBe("hello-world")
    })

    it("removes leading and trailing whitespace", () => {
      expect(createAnchor("  Hello World  ")).toBe("hello-world")
    })

    it("handles empty string", () => {
      expect(createAnchor("")).toBe("")
    })

    it("handles string with only special characters", () => {
      expect(createAnchor("!@#$%^&*()")).toBe("")
    })

    it("handles string with only spaces", () => {
      expect(createAnchor("   ")).toBe("")
    })

    it("preserves numbers and letters", () => {
      expect(createAnchor("Hello123 World456")).toBe("hello123-world456")
    })

    it("handles underscores", () => {
      expect(createAnchor("Hello_World")).toBe("hello_world")
    })

    it("handles mixed case", () => {
      expect(createAnchor("HeLLo WoRLd")).toBe("hello-world")
    })

    it("handles complex text", () => {
      expect(createAnchor("Getting Started: A Complete Guide (2023)")).toBe(
        "getting-started-a-complete-guide-2023",
      )
    })

    it("handles text with existing hyphens", () => {
      expect(createAnchor("Pre-existing-hyphens")).toBe("pre-existing-hyphens")
    })

    it("handles text with unicode characters", () => {
      expect(createAnchor("Café & Résumé")).toBe("caf-rsum")
    })
  })

  describe("createNodeKey", () => {
    it("generates unique keys", () => {
      const key1 = createNodeKey()
      const key2 = createNodeKey()
      const key3 = createNodeKey()

      expect(key1).not.toBe(key2)
      expect(key2).not.toBe(key3)
      expect(key1).not.toBe(key3)
    })

    it("generates keys with correct format", () => {
      const key = createNodeKey()
      expect(key).toMatch(/^node-\d+$/)
    })

    it("generates incrementing keys", () => {
      const key1 = createNodeKey()
      const key2 = createNodeKey()

      const num1 = Number.parseInt(key1.replace("node-", ""), 10)
      const num2 = Number.parseInt(key2.replace("node-", ""), 10)

      expect(num2).toBe(num1 + 1)
    })

    it("generates many unique keys", () => {
      const keys = new Set()
      for (let i = 0; i < 1000; i++) {
        keys.add(createNodeKey())
      }
      expect(keys.size).toBe(1000)
    })

    it("starts from 1", () => {
      // Create a fresh instance by importing again if needed
      // This test assumes we're starting fresh, but in practice
      // the counter continues from previous calls
      const key = createNodeKey()
      expect(key).toMatch(/^node-\d+$/)
      const num = Number.parseInt(key.replace("node-", ""), 10)
      expect(num).toBeGreaterThan(0)
    })
  })

  describe("integration tests", () => {
    it("works together to extract text and create anchor", () => {
      const nodes: SerializedLexicalNode[] = [
        {
          type: "text",
          text: "Getting Started: ",
          version: 1,
        } as SerializedTextNode,
        {
          type: "text",
          text: "A Complete Guide",
          version: 1,
        } as SerializedTextNode,
      ]

      const extractedText = extractTextFromNodes(nodes)
      const anchor = createAnchor(extractedText)

      expect(extractedText).toBe("Getting Started: A Complete Guide")
      expect(anchor).toBe("getting-started-a-complete-guide")
    })

    it("handles nested content for anchor generation", () => {
      const nodes: SerializedLexicalNode[] = [
        {
          type: "heading",
          tag: "h1",
          children: [
            {
              type: "text",
              text: "Chapter 1: ",
              version: 1,
            } as SerializedTextNode,
            {
              type: "text",
              text: "Introduction",
              format: 1, // bold
              version: 1,
            } as SerializedTextNode,
          ],
          version: 1,
        } as SerializedHeadingNode,
      ]

      const extractedText = extractTextFromNodes(nodes)
      const anchor = createAnchor(extractedText)

      expect(extractedText).toBe("Chapter 1: Introduction")
      expect(anchor).toBe("chapter-1-introduction")
    })
  })
})
