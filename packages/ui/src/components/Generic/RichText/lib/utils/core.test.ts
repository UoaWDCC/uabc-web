import type { SerializedLexicalNode } from "@repo/shared"
import {
  createLinkNode,
  createParagraphNode,
  createTextNode,
} from "@repo/ui/test-config/mocks/RichText.mock"
import { createAnchor, createNodeKey, extractTextFromNodes } from "./core"

describe("extractTextFromNodes", () => {
  it("should return an empty string for an empty array of nodes", () => {
    expect(extractTextFromNodes([])).toBe("")
  })

  it("should extract text from simple text nodes", () => {
    const nodes: SerializedLexicalNode[] = [createTextNode("Hello, "), createTextNode("world!")]
    expect(extractTextFromNodes(nodes)).toBe("Hello, world!")
  })

  it("should extract text from nested nodes", () => {
    const nodes: SerializedLexicalNode[] = [
      createParagraphNode([
        createTextNode("This is a "),
        createLinkNode("https://example.com", "nested link"),
        createTextNode("."),
      ]),
      createParagraphNode([createTextNode(" Another paragraph.")]),
    ]
    expect(extractTextFromNodes(nodes)).toBe("This is a nested link. Another paragraph.")
  })

  it("should handle nodes with no text property", () => {
    // biome-ignore lint/suspicious/noExplicitAny: for testing
    const nodes: SerializedLexicalNode[] = [createTextNode(undefined as any)]
    expect(extractTextFromNodes(nodes)).toBe("")
  })
})

describe("createAnchor", () => {
  it("should create a URL-friendly anchor from a string", () => {
    expect(createAnchor("  Hello World!  ")).toBe("hello-world")
    expect(createAnchor("!@#$Special%^&*()_+-=[]{}|;:'\",.<>/?`~")).toBe("special")
    expect(createAnchor(" leading-and-trailing-hyphens- ")).toBe("leading-and-trailing-hyphens")
    expect(createAnchor("multiple   spaces")).toBe("multiple-spaces")
    expect(createAnchor("multiple---hyphens")).toBe("multiple-hyphens")
  })
})

describe("createNodeKey", () => {
  it("should generate unique, sequential keys", () => {
    const key1 = createNodeKey()
    const key2 = createNodeKey()
    expect(key1).not.toBe(key2)
    const num1 = Number(key1.split("-")[1])
    const num2 = Number(key2.split("-")[1])
    expect(num2).toBe(num1 + 1)
  })
})
