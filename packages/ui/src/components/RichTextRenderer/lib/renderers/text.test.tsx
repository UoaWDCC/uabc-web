import { render, screen } from "@/test-utils"
import { TextFormat } from "../constants"
import type { RichTextRendererOptions, SerializedTextNode } from "../types"
import { renderTextNode } from "./text"

describe("renderTextNode", () => {
  const mockOptions: RichTextRendererOptions = {}

  const renderResult = (result: React.ReactNode) => {
    const TestComponent = () => result as React.ReactElement
    return render(<TestComponent />)
  }

  it("renders plain text without formatting", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "Plain text",
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    renderResult(result)

    const textElement = screen.getByText("Plain text")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("span")
  })

  it("renders bold text", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "Bold text",
      format: TextFormat.BOLD,
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Bold text")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("strong")
  })

  it("renders italic text", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "Italic text",
      format: TextFormat.ITALIC,
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Italic text")
    expect(textElement).toHaveStyle({ fontStyle: "italic" })
  })

  it("renders strikethrough text", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "Strikethrough text",
      format: TextFormat.STRIKETHROUGH,
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Strikethrough text")
    expect(textElement).toHaveStyle({ textDecoration: "line-through" })
  })

  it("renders underlined text", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "Underlined text",
      format: TextFormat.UNDERLINE,
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Underlined text")
    expect(textElement).toHaveStyle({ textDecoration: "underline" })
  })

  it("renders code text with Code component", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "Code text",
      format: TextFormat.CODE,
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const codeElement = screen.getByText("Code text")
    expect(codeElement).toBeInTheDocument()
    expect(codeElement.tagName.toLowerCase()).toBe("code")
  })

  it("renders text with bold and italic", () => {
    const result = renderTextNode(
      {
        type: "text",
        text: "Bold and italic",
        format: 3, // Bold (1) + Italic (2)
        version: 1,
      },
      "test-key",
      {},
    )
    render(<span>{result}</span>)

    const textElement = screen.getByText("Bold and italic")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("em")
    expect(textElement.parentElement?.tagName.toLowerCase()).toBe("strong")
  })

  it("renders text with bold, italic, and underline", () => {
    const result = renderTextNode(
      {
        type: "text",
        text: "Multiple formats",
        format: 11, // Bold (1) + Italic (2) + Underline (8)
        version: 1,
      },
      "test-key",
      {},
    )
    render(<span>{result}</span>)

    const textElement = screen.getByText("Multiple formats")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("em")
    expect(textElement.parentElement?.tagName.toLowerCase()).toBe("strong")
  })

  it("renders text with bold, italic, strikethrough and underline", () => {
    const result = renderTextNode(
      {
        type: "text",
        text: "Multiple formats",
        format: 15, // Bold (1) + Italic (2) + Underline (8) + Strikethrough (4)
        version: 1,
      },
      "test-key",
      {},
    )
    render(<span>{result}</span>)

    const textElement = screen.getByText("Multiple formats")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("em")
    expect(textElement.parentElement?.tagName.toLowerCase()).toBe("strong")
    expect(textElement.parentElement?.parentElement?.tagName.toLowerCase()).toBe("s")
  })

  it("renders text with strikethrough and underline", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "Strike and underline",
      format: TextFormat.STRIKETHROUGH | TextFormat.UNDERLINE, // 12 (4 + 8)
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Strike and underline")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("s")
    expect(textElement).toHaveStyle({ textDecoration: "underline" })
  })

  it("renders text with bold and strikethrough", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "Bold and strikethrough",
      format: TextFormat.BOLD | TextFormat.STRIKETHROUGH,
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Bold and strikethrough")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("strong")
    expect(textElement.parentElement?.tagName.toLowerCase()).toBe("s")
  })

  it("renders text with italic and strikethrough", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "Italic and strikethrough",
      format: TextFormat.ITALIC | TextFormat.STRIKETHROUGH,
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("Italic and strikethrough")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("em")
    expect(textElement.parentElement?.tagName.toLowerCase()).toBe("s")
  })

  it("handles text with no format property", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "No format",
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const textElement = screen.getByText("No format")
    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName.toLowerCase()).toBe("span")
  })

  it("handles text with format 0", () => {
    const node: SerializedTextNode = {
      type: "text",
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
    const node: SerializedTextNode = {
      type: "text",
      text: "",
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
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

    const node: SerializedTextNode = {
      type: "text",
      text: "Custom props",
      format: TextFormat.BOLD,
      version: 1,
    }

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

    const node: SerializedTextNode = {
      type: "text",
      text: "Code with props",
      format: TextFormat.CODE,
      version: 1,
    }

    const result = renderTextNode(node, "test-key", customOptions)
    render(<div>{result}</div>)

    const codeElement = screen.getByText("Code with props")
    expect(codeElement).toBeInTheDocument()
    expect(codeElement.tagName.toLowerCase()).toBe("code")
  })

  it("code format takes precedence over other formats", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "Bold code",
      format: TextFormat.CODE | TextFormat.BOLD, // 17 (16 + 1)
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    const codeElement = screen.getByText("Bold code")
    expect(codeElement.tagName.toLowerCase()).toBe("code")
    expect(codeElement).not.toHaveStyle({ fontWeight: "bold" })
  })

  it("uses provided key", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "Test key",
      version: 1,
    }

    const result = renderTextNode(node, "custom-key", mockOptions)

    expect(result).toBeDefined()
    expect((result as { key: string })?.key).toBe("custom-key")
  })

  it("handles special characters in text", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "Special chars: <>&\"'",
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    expect(screen.getByText("Special chars: <>&\"'")).toBeInTheDocument()
  })

  it("handles unicode characters", () => {
    const node: SerializedTextNode = {
      type: "text",
      text: "Unicode: 🚀 café résumé",
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    expect(screen.getByText("Unicode: 🚀 café résumé")).toBeInTheDocument()
  })

  it("handles very long text", () => {
    const longText = "a".repeat(1000)
    const node: SerializedTextNode = {
      type: "text",
      text: longText,
      version: 1,
    }

    const result = renderTextNode(node, "test-key", mockOptions)
    render(<span>{result}</span>)

    expect(screen.getByText(longText)).toBeInTheDocument()
  })
})
