import { render, screen } from "@testing-library/react"
import { List } from "@yamada-ui/react"
import type React from "react"
import {
  basicEditorState,
  complexEditorState,
  createCodeNodeCustom,
  createEditorState,
  createEmptyRootEditorState,
  createInternalLinkNoDoc,
  createInternalLinkStringDoc,
  createInternalLinkWithLinkDoc,
  createInvalidLinkNode,
  createInvalidUploadNode,
  createLinkNode,
  createListItemNode,
  createListNodeCustom,
  createParagraphNode,
  createParagraphNodeCustom,
  createQuoteNodeCustom,
  createTextNode,
  createUploadNodeWithFilenameOnly,
  createUploadNodeWithRelation,
  emptyEditorState,
  h1HeadingNode,
  lineBreakNode,
  simpleParagraphNode,
} from "@/test-config/mocks/RichText.mock"
import { ListType, NodeType } from "./constants"
import { RichTextRenderer, richTextRenderer } from "./RichTextRenderer"
import type { SerializedEditorState, SerializedLexicalNode } from "./types"

describe("RichTextRenderer", () => {
  const renderer = new RichTextRenderer()

  it("should return null for null or empty data", () => {
    // biome-ignore lint/suspicious/noExplicitAny: for testing
    expect(renderer.render(null as any)).toBeNull()
    // biome-ignore lint/suspicious/noExplicitAny: for testing
    expect(renderer.render(undefined as any)).toBeNull()
    expect(renderer.render(createEmptyRootEditorState())).toBeNull()

    const { container } = render(renderer.render(emptyEditorState))
    expect(container).toBeEmptyDOMElement()
  })

  it("should render a basic paragraph", () => {
    render(renderer.render(basicEditorState))
    expect(screen.getByText("Plain text")).toBeInTheDocument()
  })

  it("should render complex rich text content", () => {
    render(renderer.render(complexEditorState))

    expect(screen.getByRole("heading", { name: "Main Heading", level: 1 })).toBeInTheDocument()

    expect(screen.getByText("This is")).toBeInTheDocument()
    const boldText = screen.getByText("Bold text")
    expect(boldText.tagName).toBe("STRONG")
    expect(screen.getByText("and")).toBeInTheDocument()
    const italicText = screen.getByText("Italic text")
    expect(italicText.tagName).toBe("EM")

    const link = screen.getByRole("link", { name: "External Link" })
    expect(link).toHaveAttribute("href", "https://example.com")

    const image = screen.getByAltText("Test Image")
    expect(image).toHaveAttribute("src", "/_next/image?url=%2Ftest-image.jpg&w=640&q=75")

    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.getByText("List item 1")).toBeInTheDocument()
    expect(screen.getByText("List item 2")).toBeInTheDocument()

    expect(screen.getByText("This is a quote")).toBeInTheDocument()

    expect(screen.getByRole("separator")).toBeInTheDocument()

    expect(screen.getByText("console.log('Hello World')").closest("code")).toBeInTheDocument()
  })

  it("should use custom components when provided", () => {
    const customParagraphText = "Custom Paragraph!"
    const CustomParagraph = ({
      children,
    }: {
      node: SerializedLexicalNode
      children?: React.ReactNode
    }) => (
      <p data-testid="custom-paragraph">
        {customParagraphText}
        {children}
      </p>
    )

    render(
      renderer.render(basicEditorState, {
        customComponents: {
          [NodeType.PARAGRAPH]: CustomParagraph,
        },
      }),
    )

    expect(screen.getByTestId("custom-paragraph")).toBeInTheDocument()
    expect(screen.getByText(customParagraphText)).toBeInTheDocument()
    expect(screen.getByText("Plain text")).toBeInTheDocument()
  })

  it("should handle unknown node types gracefully", () => {
    const unknownNode = {
      type: "unknown-node",
      version: 1,
      children: [{ type: "text", text: "Unknown content", version: 1 }],
    } as const

    const editorState: SerializedEditorState = {
      root: {
        // biome-ignore lint/suspicious/noExplicitAny: for testing
        children: [unknownNode] as any,
        direction: "ltr",
        format: "",
        indent: 0,
        type: NodeType.ROOT,
        version: 1,
      },
    }

    const { container } = render(renderer.render(editorState))
    expect(screen.getByText("Unknown content")).toBeInTheDocument()
    expect(container.querySelector("div > div > span")).toBeInTheDocument()
  })

  it("should pass props to renderers", () => {
    const editorState: SerializedEditorState = {
      root: {
        children: [h1HeadingNode, simpleParagraphNode],
        direction: "ltr",
        format: "",
        indent: 0,
        type: NodeType.ROOT,
        version: 1,
      },
    }

    render(
      renderer.render(editorState, {
        headingProps: { color: "red" },
        textProps: { color: "blue" },
      }),
    )

    const heading = screen.getByRole("heading", { name: "Main Heading" })
    expect(heading).toHaveStyle("color: rgb(255, 0, 0)")

    const text = screen.getByText("Plain text")
    expect(text).toHaveStyle("color: rgb(0, 0, 255)")
  })

  it("should handle line breaks in inline nodes", () => {
    const paragraphWithLineBreak = {
      type: NodeType.PARAGRAPH as const,
      version: 1,
      children: [createTextNode("First line"), lineBreakNode, createTextNode("Second line")],
    }

    const editorState = createEditorState([paragraphWithLineBreak])
    const { container } = render(renderer.render(editorState))

    expect(container.querySelector("br")).toBeInTheDocument()
    expect(screen.getByText("First line")).toBeInTheDocument()
    expect(screen.getByText("Second line")).toBeInTheDocument()
  })

  it("should handle nodes with children that don't match specific types", () => {
    const customNodeWithChildren = {
      type: "custom-container",
      version: 1,
      children: [createTextNode("Content in custom node")],
    } as const

    const editorState: SerializedEditorState = {
      root: {
        // biome-ignore lint/suspicious/noExplicitAny: for testing
        children: [customNodeWithChildren] as any,
        direction: "ltr",
        format: "",
        indent: 0,
        type: NodeType.ROOT,
        version: 1,
      },
    }

    render(renderer.render(editorState))
    expect(screen.getByText("Content in custom node")).toBeInTheDocument()
  })

  it("should handle nested unknown nodes with children in inline context", () => {
    const nestedUnknownNode = {
      type: "nested-unknown",
      version: 1,
      children: [
        {
          type: "inner-unknown",
          version: 1,
          children: [createTextNode("Deeply nested content")],
        },
      ],
    } as const

    const paragraphWithNested = {
      type: NodeType.PARAGRAPH,
      version: 1,
      // biome-ignore lint/suspicious/noExplicitAny: for testing
      children: [createTextNode("Before "), nestedUnknownNode as any, createTextNode(" after")],
    }

    const editorState: SerializedEditorState = {
      root: {
        // biome-ignore lint/suspicious/noExplicitAny: for testing
        children: [paragraphWithNested] as any,
        direction: "ltr",
        format: "",
        indent: 0,
        type: NodeType.ROOT,
        version: 1,
      },
    }

    render(renderer.render(editorState))
    expect(screen.getByText("Before")).toBeInTheDocument()
    expect(screen.getByText("Deeply nested content")).toBeInTheDocument()
    expect(screen.getByText("after")).toBeInTheDocument()
  })

  it("should handle empty nodes with undefined children", () => {
    const emptyParagraph = createParagraphNodeCustom(undefined)
    const emptyQuote = createQuoteNodeCustom(undefined)
    const emptyList = createListNodeCustom(ListType.UNORDERED, undefined)
    const emptyListItem = createListItemNode(undefined)
    const emptyCode = createCodeNodeCustom(undefined, "javascript")

    const editorState = createEditorState([
      emptyParagraph,
      emptyQuote,
      emptyList,
      emptyListItem,
      emptyCode,
    ])

    const { container } = render(<List>{renderer.render(editorState)}</List>)
    expect(container).toBeInTheDocument()
  })

  it("should handle invalid link nodes", () => {
    const invalidLink = createInvalidLinkNode("Invalid Link", {})
    const linkNoDoc = createInternalLinkNoDoc()
    const linkStringDoc = createInternalLinkStringDoc()
    const linkWithLinkDoc = createInternalLinkWithLinkDoc()

    const editorState = createEditorState([
      createParagraphNode([invalidLink]),
      createParagraphNode([linkNoDoc]),
      createParagraphNode([linkStringDoc]),
      createParagraphNode([linkWithLinkDoc]),
    ])

    render(renderer.render(editorState))
    expect(screen.getByText("Invalid Link")).toBeInTheDocument()
    expect(screen.getByText("No Document Link")).toBeInTheDocument()
    expect(screen.getByText("String Document Link")).toBeInTheDocument()
    expect(screen.getByText("Internal Link with LinkDoc")).toBeInTheDocument()
  })

  it("should handle invalid upload nodes", () => {
    const invalidUpload = createInvalidUploadNode()
    const noUrlUpload = createUploadNodeWithFilenameOnly()
    const relatedUpload = createUploadNodeWithRelation("documents", {
      id: "1",
      url: "/doc.pdf",
      alt: "Test",
      updatedAt: "2021-01-01",
      createdAt: "2021-01-01",
    })

    const editorState = createEditorState([invalidUpload, noUrlUpload, relatedUpload])

    const { container } = render(renderer.render(editorState))
    expect(container).toBeInTheDocument()
  })

  it("should export singleton instance", () => {
    expect(richTextRenderer).toBeInstanceOf(RichTextRenderer)
    expect(typeof richTextRenderer.render).toBe("function")
    expect(typeof richTextRenderer.renderNode).toBe("function")
    expect(typeof richTextRenderer.renderInlineNodes).toBe("function")
  })

  it("should use singleton instance for rendering", () => {
    render(richTextRenderer.render(basicEditorState))
    expect(screen.getByText("Plain text")).toBeInTheDocument()
  })

  it("should handle renderInlineNodes with empty arrays", () => {
    const result = renderer.renderInlineNodes([], {})
    expect(result).toBeNull()

    // biome-ignore lint/suspicious/noExplicitAny: for testing
    const resultUndefined = renderer.renderInlineNodes(undefined as any, {})
    expect(resultUndefined).toBeNull()
  })

  it("should handle renderNode public method", () => {
    const textNode = createTextNode("Public method test")
    render(renderer.renderNode(textNode, {}))
    expect(screen.getByText("Public method test")).toBeInTheDocument()
  })

  it("should handle renderInlineNodes public method", () => {
    const textNode = createTextNode("Public method test")
    const linkNode = createLinkNode("https://test.com", "Test Link")
    render(renderer.renderInlineNodes([textNode, linkNode], {}))
    expect(screen.getByText("Public method test")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Test Link" })).toBeInTheDocument()
  })
})
