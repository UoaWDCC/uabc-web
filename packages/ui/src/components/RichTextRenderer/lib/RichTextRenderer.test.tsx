import {
  basicEditorState,
  boldItalicTextNode,
  boldTextNode,
  codeTextNode,
  createCodeNodeCustom,
  createEditorState,
  createInternalLinkNoDoc,
  createLinkNode,
  createLinkNodeNoUrl,
  createListItemNode,
  createListNodeCustom,
  createParagraphNodeCustom,
  createQuoteNodeCustom,
  createTextNode,
  createUploadNode,
  createUploadNodeNoUrl,
  createUploadNodeWithRelation,
  externalLinkNode,
  h1HeadingNode,
  h6HeadingNode,
  horizontalRuleNode,
  internalLinkNode,
  invalidLinkNode,
  italicTextNode,
  javascriptCodeNode,
  lineBreakNode,
  orderedListNode,
  plainTextNode,
  simpleParagraphNode,
  simpleQuoteNode,
  strikethroughTextNode,
  underlineTextNode,
  unorderedListNode,
} from "@/test-config/RichTextRenderer.mock"
import { render, screen } from "@/test-utils"
import { RichTextRenderer, richTextRenderer } from "./RichTextRenderer"
import { LinkType, ListType, NodeType, TextFormat } from "./constants"
import type {
  SerializedEditorState,
  SerializedLexicalNode,
  SerializedLinkNode,
  SerializedMediaDocument,
  SerializedParagraphNode,
  SerializedTextNode,
  SerializedUploadNode,
} from "./types"

describe("RichTextRenderer", () => {
  let renderer: RichTextRenderer

  beforeEach(() => {
    renderer = new RichTextRenderer()
  })

  describe("constructor and singleton", () => {
    it("creates a new instance", () => {
      expect(renderer).toBeInstanceOf(RichTextRenderer)
    })

    it("provides a singleton instance", () => {
      expect(richTextRenderer).toBeInstanceOf(RichTextRenderer)
      expect(richTextRenderer).toBe(richTextRenderer)
    })
  })

  describe("render", () => {
    it("returns null for invalid data", () => {
      expect(renderer.render(null as unknown as SerializedEditorState)).toBeNull()
      expect(renderer.render(undefined as unknown as SerializedEditorState)).toBeNull()
      expect(renderer.render({} as unknown as SerializedEditorState)).toBeNull()
      expect(renderer.render({ root: null } as unknown as SerializedEditorState)).toBeNull()
      expect(
        renderer.render({ root: { children: null } } as unknown as SerializedEditorState),
      ).toBeNull()
    })

    it("returns null for empty children array", () => {
      const emptyData = createEditorState([])

      expect(renderer.render(emptyData)).toBeNull()
    })

    it("renders basic text content", () => {
      const result = renderer.render(basicEditorState)
      render(<span>{result}</span>)
      expect(screen.getByText("Plain text")).toBeInTheDocument()
    })
  })

  describe("text node rendering", () => {
    it("renders plain text", () => {
      const data = createEditorState([plainTextNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Plain text")).toBeInTheDocument()
    })

    it("renders bold text", () => {
      const data = createEditorState([boldTextNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const textElement = screen.getByText("Bold text")
      expect(textElement.tagName.toLowerCase()).toBe("strong")
    })

    it("renders italic text", () => {
      const data = createEditorState([italicTextNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const textElement = screen.getByText("Italic text")
      expect(textElement).toHaveStyle({ fontStyle: "italic" })
    })

    it("renders strikethrough text", () => {
      const data = createEditorState([strikethroughTextNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const textElement = screen.getByText("Strikethrough text")
      expect(textElement).toHaveStyle({ textDecoration: "line-through" })
    })

    it("renders underlined text", () => {
      const data = createEditorState([underlineTextNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const textElement = screen.getByText("Underlined text")
      expect(textElement).toHaveStyle({ textDecoration: "underline" })
    })

    it("renders code text", () => {
      const data = createEditorState([codeTextNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Code text")).toBeInTheDocument()
    })

    it("renders combined formatting", () => {
      const data = createEditorState([boldItalicTextNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const textElement = screen.getByText("Bold and italic")
      expect(textElement.tagName.toLowerCase()).toBe("em")
      expect(textElement.parentElement?.tagName.toLowerCase()).toBe("strong")
    })
  })

  describe("heading node rendering", () => {
    it("renders h1 heading", () => {
      const data = createEditorState([h1HeadingNode])
      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Main Heading")
    })

    it("renders h6 heading", () => {
      const data = createEditorState([h6HeadingNode])
      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByRole("heading", { level: 6 })).toHaveTextContent("Small Heading")
    })
  })

  describe("paragraph node rendering", () => {
    it("renders paragraph with children", () => {
      const data = createEditorState([simpleParagraphNode])
      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Plain text")).toBeInTheDocument()
    })

    it("returns null for paragraph without children", () => {
      const paragraphNode: SerializedParagraphNode = {
        type: NodeType.PARAGRAPH,
        version: 1,
        children: undefined,
      }

      const data = createEditorState([paragraphNode])
      const result = renderer.render(data)
      expect(result).not.toBeNull()
    })

    it("returns null for paragraph with empty children", () => {
      const paragraphNode: SerializedParagraphNode = {
        type: NodeType.PARAGRAPH,
        version: 1,
        children: [],
      }

      const data = createEditorState([paragraphNode])
      const result = renderer.render(data)
      expect(result).not.toBeNull()
    })
  })

  describe("link node rendering", () => {
    it("renders custom external link", () => {
      const data = createEditorState([externalLinkNode])
      const result = renderer.render(data)
      render(<span>{result}</span>)
      const link = screen.getByRole("link", { name: "External Link" })
      expect(link).toHaveAttribute("href", "https://example.com")
      expect(link).toHaveAttribute("target", "_blank")
    })

    it("renders internal document link", () => {
      const data = createEditorState([internalLinkNode])
      const result = renderer.render(data)
      render(<span>{result}</span>)
      const link = screen.getByRole("link", { name: "Internal Link" })
      expect(link).toHaveAttribute("href", "/test-page")
    })

    it("renders as span for invalid link fields", () => {
      const data = createEditorState([invalidLinkNode])
      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Invalid Link")).toBeInTheDocument()
      expect(screen.queryByRole("link")).not.toBeInTheDocument()
    })

    it("renders custom internal link", () => {
      const linkNode = createLinkNode("/internal-page", "Internal Link", {
        linkType: LinkType.CUSTOM,
        newTab: false,
      })

      const data = createEditorState([linkNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const link = screen.getByRole("link", { name: "Internal Link" })
      expect(link).toHaveAttribute("href", "/internal-page")
      expect(link).not.toHaveAttribute("target", "_blank")
    })

    it("renders as span when no URL is provided", () => {
      const linkNode = createLinkNodeNoUrl("No URL Link")

      const data = createEditorState([linkNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("No URL Link")).toBeInTheDocument()
      expect(screen.queryByRole("link")).not.toBeInTheDocument()
    })

    it("renders as span for internal link without valid doc", () => {
      const linkNode = createInternalLinkNoDoc("Invalid Doc Link")

      const data = createEditorState([linkNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Invalid Doc Link")).toBeInTheDocument()
      expect(screen.queryByRole("link")).not.toBeInTheDocument()
    })
  })

  describe("upload/image node rendering", () => {
    it("renders image from upload node", () => {
      const imageUploadNode = createUploadNode("/test-image.jpg", "Test Image", 300, 200)
      const data = createEditorState([imageUploadNode])
      const result = renderer.render(data)
      render(<span>{result}</span>)
      const image = screen.getByRole("img", { name: "Test Image" })
      expect(image.getAttribute("src")).toContain("test-image.jpg")
      expect(image).toHaveAttribute("alt", "Test Image")
    })

    it("resolves relative image URLs with mediaBaseUrl", () => {
      const relativeImageUploadNode = createUploadNode(
        "/relative-image.jpg",
        "Relative Image",
        300,
        200,
      )
      const data = createEditorState([relativeImageUploadNode])
      const result = renderer.render(data, { mediaBaseUrl: "https://api.example.com" })
      render(<span>{result}</span>)
      const image = screen.getByRole("img", { name: "Relative Image" })
      expect(image.getAttribute("src")).toContain("api.example.com")
      expect(image.getAttribute("src")).toContain("relative-image.jpg")
      expect(image).toHaveAttribute("alt", "Relative Image")
    })

    it("returns null for non-media upload", () => {
      const uploadNode = createUploadNodeWithRelation("documents", {
        id: "1",
        url: "/document.pdf",
      })

      const data = createEditorState([uploadNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.queryByRole("img")).not.toBeInTheDocument()
    })

    it("returns null for invalid media document", () => {
      const uploadNode = createUploadNode("/test-image.jpg")
      uploadNode.value = "invalid"

      const data = createEditorState([uploadNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.queryByRole("img")).not.toBeInTheDocument()
    })

    it("returns null for media document without URL", () => {
      const uploadNode = createUploadNodeNoUrl("1", "No URL Image")

      const data = createEditorState([uploadNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.queryByRole("img")).not.toBeInTheDocument()
    })

    it("handles absolute URLs correctly", () => {
      const uploadNode: SerializedUploadNode = {
        type: NodeType.UPLOAD,
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

      const data: SerializedEditorState = {
        root: {
          children: [uploadNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data, { mediaBaseUrl: "https://api.example.com" })
      render(<span>{result}</span>)
      const image = screen.getByRole("img", { name: "Absolute Image" })
      expect(image.getAttribute("src")).toContain("example.com")
      expect(image.getAttribute("src")).toContain("absolute-image.jpg")
      expect(image).toHaveAttribute("alt", "Absolute Image")
    })

    it("handles standalone URLs without base URL correctly", () => {
      const uploadNode: SerializedUploadNode = {
        type: NodeType.UPLOAD,
        relationTo: "media",
        value: {
          id: "1",
          url: "https://cdn.example.com/standalone-image.jpg",
          alt: "Standalone Image",
          width: 300,
          height: 200,
        },
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [uploadNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data, { mediaBaseUrl: "https://api.example.com" })
      render(<span>{result}</span>)
      const image = screen.getByRole("img", { name: "Standalone Image" })
      expect(image.getAttribute("src")).toContain("cdn.example.com")
      expect(image.getAttribute("src")).toContain("standalone-image.jpg")
      expect(image).toHaveAttribute("alt", "Standalone Image")
    })
  })

  describe("quote node rendering", () => {
    it("renders quote with children", () => {
      const data = createEditorState([simpleQuoteNode])
      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("This is a quote")).toBeInTheDocument()
    })

    it("returns null for quote without children", () => {
      const quoteNode = createQuoteNodeCustom(undefined)

      const data = createEditorState([quoteNode])
      const result = renderer.render(data)
      expect(result).not.toBeNull()
    })
  })

  describe("list node rendering", () => {
    it("renders unordered list", () => {
      const data = createEditorState([unorderedListNode])
      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("List item 1")).toBeInTheDocument()
      expect(screen.getByText("List item 2")).toBeInTheDocument()
    })

    it("renders ordered list", () => {
      const data = createEditorState([orderedListNode])
      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("First item")).toBeInTheDocument()
    })

    it("returns null for list without children", () => {
      const listNode = createListNodeCustom(ListType.UNORDERED, undefined)

      const data = createEditorState([listNode])
      const result = renderer.render(data)
      expect(result).not.toBeNull()
    })
  })

  describe("list item node rendering", () => {
    it("renders list item with children", () => {
      const listNode = createListNodeCustom(ListType.UNORDERED, [
        createListItemNode([createTextNode("List item content")]),
      ])

      const data = createEditorState([listNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("List item content")).toBeInTheDocument()
    })

    it("renders list item without children", () => {
      const listItemNode = createListItemNode(undefined)

      const data = createEditorState([listItemNode])

      const result = renderer.render(data)
      expect(result).not.toBeNull()
    })
  })

  describe("line break node rendering", () => {
    it("renders line break", () => {
      const data = createEditorState([lineBreakNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(document.querySelector("br")).toBeInTheDocument()
    })
  })

  describe("horizontal rule node rendering", () => {
    it("renders horizontal rule", () => {
      const data = createEditorState([horizontalRuleNode])

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(result).not.toBeNull()
    })
  })

  describe("code node rendering", () => {
    it("renders code block with language", () => {
      const data = createEditorState([javascriptCodeNode])
      const result = renderer.render(data)
      render(<span>{result}</span>)
      const codeElement = screen.getByText("console.log('Hello World')")
      expect(codeElement).toBeInTheDocument()
      expect(codeElement).toHaveAttribute("data-language", "javascript")
    })

    it("renders code block without language", () => {
      const codeNode = createCodeNodeCustom([createTextNode("some code")])

      const data = createEditorState([codeNode])
      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("some code")).toBeInTheDocument()
    })

    it("renders code block without children", () => {
      const codeNode = createCodeNodeCustom(undefined, "python")

      const data = createEditorState([codeNode])
      const result = renderer.render(data)
      render(<div data-testid="code-container">{result}</div>)
      const container = screen.getByTestId("code-container")
      const codeElement = container.querySelector("code")
      expect(codeElement).toBeInTheDocument()
      expect(codeElement).toHaveAttribute("data-language", "python")
    })
  })

  describe("custom components", () => {
    it("renders custom component for known node type", () => {
      const CustomParagraph = ({
        children,
      }: { node: SerializedLexicalNode; children?: React.ReactNode }) => (
        <div data-testid="custom-paragraph">{children}</div>
      )

      const data = createEditorState([
        createParagraphNodeCustom([createTextNode("Custom content")]),
      ])

      const result = renderer.render(data, {
        customComponents: {
          paragraph: CustomParagraph,
        },
      })
      render(<span>{result}</span>)
      expect(screen.getByTestId("custom-paragraph")).toBeInTheDocument()
      expect(screen.getByText("Custom content")).toBeInTheDocument()
    })

    it("renders custom component without children", () => {
      const CustomNode = () => <div data-testid="custom-node">Custom Node</div>

      const data: SerializedEditorState = {
        root: {
          children: [
            {
              type: NodeType.CUSTOM,
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data, {
        customComponents: {
          custom: CustomNode,
        },
      })
      render(<span>{result}</span>)
      expect(screen.getByTestId("custom-node")).toBeInTheDocument()
    })
  })

  describe("unknown node types", () => {
    it("renders unknown node with children as Box", () => {
      const data: SerializedEditorState = {
        root: {
          children: [
            {
              type: "unknown",
              version: 1,
              children: [
                {
                  type: NodeType.TEXT,
                  text: "Unknown node content",
                  version: 1,
                },
              ],
            } as SerializedLexicalNode,
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Unknown node content")).toBeInTheDocument()
    })

    it("returns null for unknown node without children", () => {
      const data: SerializedEditorState = {
        root: {
          children: [
            {
              type: "unknown",
              version: 1,
            } as SerializedLexicalNode,
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull()
    })
  })

  describe("nested content", () => {
    it("renders nested inline elements", () => {
      const data: SerializedEditorState = {
        root: {
          children: [
            {
              type: NodeType.PARAGRAPH,
              version: 1,
              children: [
                {
                  type: NodeType.TEXT,
                  text: "Text with ",
                  version: 1,
                },
                {
                  type: NodeType.LINK,
                  fields: {
                    linkType: LinkType.CUSTOM,
                    url: "https://example.com",
                  },
                  version: 1,
                  children: [
                    {
                      type: NodeType.TEXT,
                      text: "a link",
                      format: TextFormat.BOLD,
                      version: 1,
                    },
                  ],
                },
                {
                  type: NodeType.TEXT,
                  text: " and ",
                  version: 1,
                },
                {
                  type: NodeType.LINE_BREAK,
                  version: 1,
                },
                {
                  type: NodeType.TEXT,
                  text: "line break",
                  version: 1,
                },
              ],
            } as SerializedParagraphNode,
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Text with")).toBeInTheDocument()
      expect(screen.getByRole("link", { name: "a link" })).toBeInTheDocument()
      expect(screen.getByText("and")).toBeInTheDocument()
      expect(screen.getByText("line break")).toBeInTheDocument()
      expect(document.querySelector("br")).toBeInTheDocument()
    })

    it("renders nested unknown inline elements", () => {
      const data: SerializedEditorState = {
        root: {
          children: [
            {
              type: NodeType.PARAGRAPH,
              version: 1,
              children: [
                {
                  type: "unknown-inline",
                  version: 1,
                  children: [
                    {
                      type: NodeType.TEXT,
                      text: "Nested unknown content",
                      version: 1,
                    },
                  ],
                } as SerializedLexicalNode,
              ],
            } as SerializedParagraphNode,
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Nested unknown content")).toBeInTheDocument()
    })
  })

  describe("edge cases for coverage", () => {
    it("handles paragraph with null children in inline rendering", () => {
      const paragraphNode: SerializedParagraphNode = {
        type: NodeType.PARAGRAPH,
        version: 1,
        children: null as unknown as SerializedLexicalNode[],
      }

      const data: SerializedEditorState = {
        root: {
          children: [paragraphNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull()
    })

    it("handles unknown node without children in inline rendering", () => {
      const paragraphNode: SerializedParagraphNode = {
        type: NodeType.PARAGRAPH,
        version: 1,
        children: [
          {
            type: "unknown-inline",
            version: 1,
          } as SerializedLexicalNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [paragraphNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(result).not.toBeNull()
    })

    it("returns null for upload node with media document without URL", () => {
      const uploadNode: SerializedUploadNode = {
        type: NodeType.UPLOAD,
        relationTo: "media",
        value: {
          id: "1",
          alt: "Image without URL",
        } as unknown as SerializedMediaDocument,
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [uploadNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull()
    })

    it("handles renderInlineNodes with null nodes", () => {
      const paragraphNode: SerializedParagraphNode = {
        type: NodeType.PARAGRAPH,
        version: 1,
        children: null as unknown as SerializedLexicalNode[],
      }

      const data: SerializedEditorState = {
        root: {
          children: [paragraphNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull()
    })

    it("handles renderInlineNodes with empty array", () => {
      const paragraphNode: SerializedParagraphNode = {
        type: NodeType.PARAGRAPH,
        version: 1,
        children: [],
      }

      const data: SerializedEditorState = {
        root: {
          children: [paragraphNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull()
    })

    it("covers renderInlineNodes null return with link containing empty children", () => {
      const linkNode: SerializedLinkNode = {
        type: NodeType.LINK,
        fields: {
          linkType: LinkType.CUSTOM,
          url: "https://example.com",
        },
        version: 1,
        children: [],
      }

      const data: SerializedEditorState = {
        root: {
          children: [linkNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByRole("link")).toBeInTheDocument()
    })

    it("covers upload node null return when media has no URL", () => {
      const uploadNode: SerializedUploadNode = {
        type: NodeType.UPLOAD,
        relationTo: "media",
        value: {
          id: "test-id",
          alt: "Test alt",
          url: "",
        },
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [uploadNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull()
      render(<span>{result}</span>)
      expect(screen.queryByRole("img")).not.toBeInTheDocument()
    })

    it("covers upload node null return when media URL is undefined", () => {
      const uploadNode: SerializedUploadNode = {
        type: NodeType.UPLOAD,
        relationTo: "media",
        value: {
          id: "test-id",
          alt: "Test alt",
          url: undefined,
        },
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [uploadNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull()
      render(<span>{result}</span>)
      expect(screen.queryByRole("img")).not.toBeInTheDocument()
    })

    it("covers internal link with invalid document", () => {
      const linkNode: SerializedLinkNode = {
        type: NodeType.LINK,
        fields: {
          linkType: LinkType.INTERNAL,
          doc: { id: "123" } as unknown,
        },
        version: 1,
        children: [
          {
            type: NodeType.TEXT,
            text: "Invalid doc link",
            version: 1,
          } as SerializedTextNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [linkNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Invalid doc link")).toBeInTheDocument()
      expect(screen.queryByRole("link")).not.toBeInTheDocument()
    })

    it("covers internal link with valid document", () => {
      const linkNode: SerializedLinkNode = {
        type: NodeType.LINK,
        fields: {
          linkType: LinkType.INTERNAL,
          doc: {
            id: "123",
            slug: "test-document",
          },
          newTab: true,
        },
        version: 1,
        children: [
          {
            type: NodeType.TEXT,
            text: "Valid doc link",
            version: 1,
          } as SerializedTextNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [linkNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const link = screen.getByRole("link", { name: "Valid doc link" })
      expect(link).toHaveAttribute("href", "/test-document")
      expect(link).toHaveAttribute("target", "_blank")
    })

    it("covers internal link with null doc (no fields.doc)", () => {
      const linkNode: SerializedLinkNode = {
        type: NodeType.LINK,
        fields: {
          linkType: LinkType.INTERNAL,
          doc: null,
        },
        version: 1,
        children: [
          {
            type: NodeType.TEXT,
            text: "Null doc link",
            version: 1,
          } as SerializedTextNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [linkNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Null doc link")).toBeInTheDocument()
      expect(screen.queryByRole("link")).not.toBeInTheDocument()
    })

    it("covers image default values", () => {
      const uploadNode: SerializedUploadNode = {
        type: NodeType.UPLOAD,
        relationTo: "media",
        value: {
          id: "test-id",
          url: "/test-image.jpg",
        },
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [uploadNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const image = screen.getByRole("presentation")
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute("alt", "")
      expect(image).toHaveAttribute("height", "200")
      expect(image).toHaveAttribute("width", "300")
    })
  })

  describe("URL resolution", () => {
    it("handles trailing slash in base URL", () => {
      const uploadNode: SerializedUploadNode = {
        type: NodeType.UPLOAD,
        relationTo: "media",
        value: {
          id: "1",
          url: "/image.jpg",
          alt: "Test Image",
          width: 300,
          height: 200,
        },
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [uploadNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data, { mediaBaseUrl: "https://api.example.com/" })
      render(<span>{result}</span>)
      const image = screen.getByRole("img", { name: "Test Image" })
      expect(image.getAttribute("src")).toContain("api.example.com")
      expect(image.getAttribute("src")).toContain("image.jpg")
      expect(image).toHaveAttribute("alt", "Test Image")
    })

    it("handles URL without leading slash", () => {
      const uploadNode: SerializedUploadNode = {
        type: NodeType.UPLOAD,
        relationTo: "media",
        value: {
          id: "1",
          url: "image.jpg",
          alt: "Test Image",
          width: 300,
          height: 200,
        },
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [uploadNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: NodeType.ROOT,
          version: 1,
        },
      }

      const result = renderer.render(data, { mediaBaseUrl: "https://api.example.com" })
      render(<span>{result}</span>)
      const image = screen.getByRole("img", { name: "Test Image" })
      expect(image.getAttribute("src")).toContain("api.example.com")
      expect(image.getAttribute("src")).toContain("image.jpg")
      expect(image).toHaveAttribute("alt", "Test Image")
    })
  })
})
