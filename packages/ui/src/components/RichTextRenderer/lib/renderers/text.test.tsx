import {
  boldItalicTextNode,
  boldTextNode,
  codeTextNode,
  createTextNode,
  emptyTextNode,
  italicTextNode,
  multipleFormatsTextNode,
  plainTextNode,
  strikeUnderlineTextNode,
  strikethroughTextNode,
  underlineTextNode,
} from "@/test-config/RichTextRenderer.mock"
import { render, screen } from "@/test-utils"
import { NodeType, TextFormat } from "../constants"
import type { RichTextRendererOptions, SerializedTextNode } from "../types"
import { renderTextNode } from "./text"

describe("renderTextNode", () => {
  const mockOptions: RichTextRendererOptions = {}

  const renderResult = (result: React.ReactNode) => {
    const TestComponent = () => result as React.ReactElement
    return render(<TestComponent />)
  }

  it("renders plain text without formatting", () => {
    const result = renderTextNode(plainTextNode, "test-key", mockOptions)
    renderResult(result)

    const textElement = screen.getByText("Plain text")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("span")
  })

  it("renders bold text", () => {
    const result = renderTextNode(boldTextNode, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Bold text")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("strong")
  })

  it("renders italic text", () => {
    const result = renderTextNode(italicTextNode, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Italic text")
    expect(textElement).toHaveStyle({ fontStyle: "italic" })
  })

  it("renders strikethrough text", () => {
    const result = renderTextNode(strikethroughTextNode, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Strikethrough text")
    expect(textElement).toHaveStyle({ textDecoration: "line-through" })
  })

  it("renders underlined text", () => {
    const result = renderTextNode(underlineTextNode, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Underlined text")
    expect(textElement).toHaveStyle({ textDecoration: "underline" })
  })

  it("renders code text with Code component", () => {
    const result = renderTextNode(codeTextNode, "test-key", mockOptions)
    render(<span>{result}</span>)

    const codeElement = screen.getByText("Code text")
    expect(codeElement).toBeInTheDocument()
    expect(codeElement.tagName.toLowerCase()).toBe("code")
  })

  it("renders text with bold and italic", () => {
    const result = renderTextNode(boldItalicTextNode, "test-key", {})
    render(<span>{result}</span>)

    const textElement = screen.getByText("Bold and italic")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("em")
    expect(textElement.parentElement?.tagName.toLowerCase()).toBe("strong")
  })

  it("renders text with bold, italic, strikethrough and underline", () => {
    const result = renderTextNode(multipleFormatsTextNode, "test-key", {})
    render(<span>{result}</span>)

    const textElement = screen.getByText("Multiple formats")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("em")
    expect(textElement.parentElement?.tagName.toLowerCase()).toBe("strong")
    expect(textElement.parentElement?.parentElement?.tagName.toLowerCase()).toBe("s")
  })

  it("renders text with strikethrough and underline", () => {
    const result = renderTextNode(strikeUnderlineTextNode, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Strike and underline")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("s")
    expect(textElement).toHaveStyle({ textDecoration: "underline" })
  })

  it("renders text with bold and strikethrough", () => {
    const node = createTextNode(
      "Bold and strikethrough",
      TextFormat.BOLD | TextFormat.STRIKETHROUGH,
    )

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Bold and strikethrough")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("strong")
    expect(textElement.parentElement?.tagName.toLowerCase()).toBe("s")
  })

  it("renders text with italic and strikethrough", () => {
    const node = createTextNode(
      "Italic and strikethrough",
      TextFormat.ITALIC | TextFormat.STRIKETHROUGH,
    )

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Italic and strikethrough")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("em")
    expect(textElement.parentElement?.tagName.toLowerCase()).toBe("s")
  })

  it("handles text with format 0", () => {
    const node: SerializedTextNode = {
      type: NodeType.TEXT,
      text: "Format zero",
      format: 0,
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Format zero")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("span")
  })

  it("handles empty text", () => {
    const result = renderTextNode(emptyTextNode, "test-key", mockOptions)
    render(<div data-testid="empty-text-container">{result}</div>)

    const container = screen.getByTestId("empty-text-container")
    expect(container.querySelector("span")).toBeInTheDocument()
  })

  it("applies custom text props when not code", () => {
    const customOptions: RichTextRendererOptions = {
      textProps: {
        color: "red.500",
        fontSize: "lg",
      },
    }

    const node = createTextNode("Custom props", TextFormat.BOLD)

    const result = renderTextNode(node, "test-key", customOptions)
    render(<div>{result}</div>)

    const textElement = screen.getByText("Custom props")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("strong")
  })

  it("applies custom code props when format is code", () => {
    const customOptions: RichTextRendererOptions = {
      codeProps: {
        bg: "gray.100",
        color: "purple.600",
      },
    }

    const node = createTextNode("Code with props", TextFormat.CODE)

    const result = renderTextNode(node, "test-key", customOptions)
    render(<div>{result}</div>)

    const codeElement = screen.getByText("Code with props")
    expect(codeElement).toBeInTheDocument()
    expect(codeElement.tagName.toLowerCase()).toBe("code")
  })

  it("code format takes precedence over other formats", () => {
    const node = createTextNode("Bold code", TextFormat.CODE | TextFormat.BOLD)

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const codeElement = screen.getByText("Bold code")
    expect(codeElement.tagName.toLowerCase()).toBe("code")
    expect(codeElement).not.toHaveStyle({ fontWeight: "bold" })
  })

  it("uses provided key", () => {
    const node = createTextNode("Test key")

    const result = renderTextNode(node, "custom-key", mockOptions)

    expect(result).toBeDefined()
    expect((result as { key: string })?.key).toBe("custom-key")
  })
})
