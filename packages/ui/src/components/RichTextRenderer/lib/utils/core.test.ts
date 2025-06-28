import {
  createHeadingNode,
  createListNode,
  createParagraphNode,
  createTextNode,
  emptyTextNode,
} from "@/test-config/RichTextRenderer.mock"
import { ListType } from "../constants"
import { NodeType } from "../constants"
import type { SerializedLexicalNode, SerializedTextNode } from "../types"
import { createAnchor, createNodeKey, extractTextFromNodes } from "./core"

describe("Core Utilities", () => {
  describe("extractTextFromNodes", () => {
    it("extracts text from a single text node", () => {
      const nodes: SerializedLexicalNode[] = [createTextNode("Hello world")]

      expect(extractTextFromNodes(nodes)).toBe("Hello world")
    })

    it("extracts text from multiple text nodes", () => {
      const nodes: SerializedLexicalNode[] = [createTextNode("Hello "), createTextNode("world")]

      expect(extractTextFromNodes(nodes)).toBe("Hello world")
    })

    it("extracts text from nested nodes with children", () => {
      const nodes: SerializedLexicalNode[] = [
        createParagraphNode([createTextNode("Nested "), createTextNode("text")]),
      ]

      expect(extractTextFromNodes(nodes)).toBe("Nested text")
    })

    it("extracts text from deeply nested nodes", () => {
      const nodes: SerializedLexicalNode[] = [
        createListNode(ListType.UNORDERED, ["Item 1", "Item 2"]),
      ]

      expect(extractTextFromNodes(nodes)).toBe("Item 1Item 2")
    })

    it("handles empty text nodes", () => {
      const nodes: SerializedLexicalNode[] = [emptyTextNode]

      expect(extractTextFromNodes(nodes)).toBe("")
    })

    it("handles nodes without text property", () => {
      const nodes: SerializedLexicalNode[] = [
        {
          type: NodeType.LINE_BREAK,
          version: 1,
        },
        createTextNode("Hello"),
      ]

      expect(extractTextFromNodes(nodes)).toBe("Hello")
    })

    it("handles empty array", () => {
      expect(extractTextFromNodes([])).toBe("")
    })

    it("handles mixed node types", () => {
      const nodes: SerializedLexicalNode[] = [
        createTextNode("Start"),
        {
          type: NodeType.LINE_BREAK,
          version: 1,
        },
        createParagraphNode([createTextNode("Middle")]),
        createTextNode("End"),
      ]

      expect(extractTextFromNodes(nodes)).toBe("StartMiddleEnd")
    })

    it("handles nodes with undefined or null text", () => {
      const nodes: SerializedLexicalNode[] = [
        {
          type: NodeType.TEXT,
          text: undefined,
          version: 1,
        } as unknown as SerializedTextNode,
        {
          type: NodeType.TEXT,
          text: null,
          version: 1,
        } as unknown as SerializedTextNode,
        createTextNode("Valid text"),
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
      const key = createNodeKey()
      expect(key).toMatch(/^node-\d+$/)
      const num = Number.parseInt(key.replace("node-", ""), 10)
      expect(num).toBeGreaterThan(0)
    })
  })

  describe("integration tests", () => {
    it("works together to extract text and create anchor", () => {
      const nodes: SerializedLexicalNode[] = [
        createTextNode("Getting Started: "),
        createTextNode("A Complete Guide"),
      ]

      const extractedText = extractTextFromNodes(nodes)
      const anchor = createAnchor(extractedText)

      expect(extractedText).toBe("Getting Started: A Complete Guide")
      expect(anchor).toBe("getting-started-a-complete-guide")
    })

    it("handles nested content for anchor generation", () => {
      const nodes: SerializedLexicalNode[] = [createHeadingNode("h1", "Chapter 1: Introduction")]

      const extractedText = extractTextFromNodes(nodes)
      const anchor = createAnchor(extractedText)

      expect(extractedText).toBe("Chapter 1: Introduction")
      expect(anchor).toBe("chapter-1-introduction")
    })
  })
})
