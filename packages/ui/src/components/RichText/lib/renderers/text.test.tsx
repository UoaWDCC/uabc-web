import { render, screen } from "@testing-library/react"
import { NodeType, TextFormat } from "../constants"
import type { SerializedTextNode } from "../types"
import { renderTextNode } from "./text"

const baseNode: SerializedTextNode = {
  type: NodeType.TEXT,
  text: "Hello, world!",
  version: 1,
}

describe("renderTextNode", () => {
  it("should render plain text", () => {
    render(renderTextNode(baseNode, "test-key", {}))
    expect(screen.getByText("Hello, world!")).toBeInTheDocument()
  })

  it("should render bold text", () => {
    const node = { ...baseNode, format: TextFormat.BOLD }
    render(renderTextNode(node, "test-key", {}))
    expect(screen.getByText("Hello, world!").tagName).toBe("STRONG")
  })

  it("should render italic text", () => {
    const node = { ...baseNode, format: TextFormat.ITALIC }
    render(renderTextNode(node, "test-key", {}))
    expect(screen.getByText("Hello, world!").tagName).toBe("EM")
  })

  it("should render strikethrough text", () => {
    const node = { ...baseNode, format: TextFormat.STRIKETHROUGH }
    render(renderTextNode(node, "test-key", {}))
    expect(screen.getByText("Hello, world!").tagName).toBe("S")
  })

  it("should render underline text", () => {
    const node = { ...baseNode, format: TextFormat.UNDERLINE }
    render(renderTextNode(node, "test-key", {}))
    const textElement = screen.getByText("Hello, world!")
    expect(textElement.tagName).toBe("SPAN")
    expect(textElement).toHaveStyle("text-decoration: underline")
  })

  it("should render code", () => {
    render(renderTextNode({ ...baseNode, format: TextFormat.CODE }, "test-key", {}))
    expect(screen.getByText("Hello, world!").tagName).toBe("CODE")
  })

  it("should render combined formats (bold and italic)", () => {
    const node = { ...baseNode, format: TextFormat.BOLD | TextFormat.ITALIC }
    render(renderTextNode(node, "test-key", {}))
    const textElement = screen.getByText("Hello, world!")
    expect(textElement.closest("strong")).toBeInTheDocument()
    expect(textElement.closest("em")).toBeInTheDocument()
  })

  it("should pass textProps to the Text component", () => {
    render(renderTextNode(baseNode, "test-key", { textProps: { color: "red" } }))
    expect(screen.getByText("Hello, world!")).toHaveStyle("color: rgb(255, 0, 0)")
  })

  it("should pass codeProps to the Code component", () => {
    const node = { ...baseNode, format: TextFormat.CODE }
    render(renderTextNode(node, "test-key", { codeProps: { color: "blue" } }))
    const codeElement = screen.getByText("Hello, world!")
    expect(codeElement.tagName).toBe("CODE")
    expect(codeElement).toHaveStyle("color: rgb(0, 0, 255)")
  })

  it("should return null if text is null", () => {
    const node = { ...baseNode, text: null as unknown as string }
    const result = renderTextNode(node, "test-key", {})
    expect(result).toBeNull()
  })
})
