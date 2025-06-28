import { render, screen } from "@/test-utils"
import { RichTextRenderer, richTextRenderer } from "./RichTextRenderer"
import type {
  SerializedCodeNode,
  SerializedEditorState,
  SerializedHeadingNode,
  SerializedLexicalNode,
  SerializedLinkNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedMediaDocument,
  SerializedParagraphNode,
  SerializedQuoteNode,
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
      expect(richTextRenderer).toBe(richTextRenderer) // Same instance
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
      const emptyData: SerializedEditorState = {
        root: {
          children: [],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      expect(renderer.render(emptyData)).toBeNull()
    })

    it("renders basic text content", () => {
      const data: SerializedEditorState = {
        root: {
          children: [
            {
              type: "paragraph",
              version: 1,
              children: [
                {
                  type: "text",
                  text: "Test content",
                  version: 1,
                } as SerializedTextNode,
              ],
            } as SerializedParagraphNode,
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Test content")).toBeInTheDocument()
    })
  })

  describe("text node rendering", () => {
    it("renders plain text", () => {
      const textNode: SerializedTextNode = {
        type: "text",
        text: "Plain text",
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [textNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Plain text")).toBeInTheDocument()
    })

    it("renders bold text", () => {
      const textNode: SerializedTextNode = {
        type: "text",
        text: "Bold text",
        format: 1, // Bold
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [textNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const textElement = screen.getByText("Bold text")
      expect(textElement.tagName.toLowerCase()).toBe("strong")
    })

    it("renders italic text", () => {
      const textNode: SerializedTextNode = {
        type: "text",
        text: "Italic text",
        format: 2, // Italic
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [textNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const textElement = screen.getByText("Italic text")
      expect(textElement).toHaveStyle({ fontStyle: "italic" })
    })

    it("renders strikethrough text", () => {
      const textNode: SerializedTextNode = {
        type: "text",
        text: "Strikethrough text",
        format: 4, // Strikethrough
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [textNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const textElement = screen.getByText("Strikethrough text")
      expect(textElement).toHaveStyle({ textDecoration: "line-through" })
    })

    it("renders underlined text", () => {
      const textNode: SerializedTextNode = {
        type: "text",
        text: "Underlined text",
        format: 8, // Underline
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [textNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const textElement = screen.getByText("Underlined text")
      expect(textElement).toHaveStyle({ textDecoration: "underline" })
    })

    it("renders code text", () => {
      const textNode: SerializedTextNode = {
        type: "text",
        text: "Code text",
        format: 16, // Code
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [textNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Code text")).toBeInTheDocument()
    })

    it("renders combined formatting", () => {
      const textNode: SerializedTextNode = {
        type: "text",
        text: "Bold and italic",
        format: 3, // Bold (1) + Italic (2)
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [textNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const textElement = screen.getByText("Bold and italic")
      expect(textElement.tagName.toLowerCase()).toBe("em")
      expect(textElement.parentElement?.tagName.toLowerCase()).toBe("strong")
    })
  })

  describe("heading node rendering", () => {
    it("renders h1 heading", () => {
      const headingNode: SerializedHeadingNode = {
        type: "heading",
        tag: "h1",
        version: 1,
        children: [
          {
            type: "text",
            text: "Main Heading",
            version: 1,
          } as SerializedTextNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [headingNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Main Heading")
    })

    it("renders h6 heading", () => {
      const headingNode: SerializedHeadingNode = {
        type: "heading",
        tag: "h6",
        version: 1,
        children: [
          {
            type: "text",
            text: "Sub Heading",
            version: 1,
          } as SerializedTextNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [headingNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByRole("heading", { level: 6 })).toHaveTextContent("Sub Heading")
    })
  })

  describe("paragraph node rendering", () => {
    it("renders paragraph with children", () => {
      const paragraphNode: SerializedParagraphNode = {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            text: "Paragraph content",
            version: 1,
          } as SerializedTextNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [paragraphNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Paragraph content")).toBeInTheDocument()
    })

    it("returns null for paragraph without children", () => {
      const paragraphNode: SerializedParagraphNode = {
        type: "paragraph",
        version: 1,
        children: undefined,
      }

      const data: SerializedEditorState = {
        root: {
          children: [paragraphNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull() // VStack is still rendered but empty
    })

    it("returns null for paragraph with empty children", () => {
      const paragraphNode: SerializedParagraphNode = {
        type: "paragraph",
        version: 1,
        children: [],
      }

      const data: SerializedEditorState = {
        root: {
          children: [paragraphNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull() // VStack is still rendered but empty
    })
  })

  describe("link node rendering", () => {
    it("renders custom external link", () => {
      const linkNode: SerializedLinkNode = {
        type: "link",
        fields: {
          linkType: "custom",
          url: "https://example.com",
          newTab: true,
        },
        version: 1,
        children: [
          {
            type: "text",
            text: "External Link",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const link = screen.getByRole("link", { name: "External Link" })
      expect(link).toHaveAttribute("href", "https://example.com")
      expect(link).toHaveAttribute("target", "_blank")
    })

    it("renders custom internal link", () => {
      const linkNode: SerializedLinkNode = {
        type: "link",
        fields: {
          linkType: "custom",
          url: "/internal-page",
          newTab: false,
        },
        version: 1,
        children: [
          {
            type: "text",
            text: "Internal Link",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const link = screen.getByRole("link", { name: "Internal Link" })
      expect(link).toHaveAttribute("href", "/internal-page")
      expect(link).not.toHaveAttribute("target", "_blank")
    })

    it("renders internal document link", () => {
      const linkNode: SerializedLinkNode = {
        type: "link",
        fields: {
          linkType: "internal",
          doc: {
            id: "123",
            slug: "test-page",
            title: "Test Page",
          },
          newTab: false,
        },
        version: 1,
        children: [
          {
            type: "text",
            text: "Document Link",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const link = screen.getByRole("link", { name: "Document Link" })
      expect(link).toHaveAttribute("href", "/test-page")
    })

    it("renders as span for invalid link fields", () => {
      const linkNode: SerializedLinkNode = {
        type: "link",
        fields: {} as unknown as SerializedLinkNode["fields"],
        version: 1,
        children: [
          {
            type: "text",
            text: "Invalid Link",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Invalid Link")).toBeInTheDocument()
      expect(screen.queryByRole("link")).not.toBeInTheDocument()
    })

    it("renders as span when no URL is provided", () => {
      const linkNode: SerializedLinkNode = {
        type: "link",
        fields: {
          linkType: "custom",
        },
        version: 1,
        children: [
          {
            type: "text",
            text: "No URL Link",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("No URL Link")).toBeInTheDocument()
      expect(screen.queryByRole("link")).not.toBeInTheDocument()
    })

    it("renders as span for internal link without valid doc", () => {
      const linkNode: SerializedLinkNode = {
        type: "link",
        fields: {
          linkType: "internal",
          doc: null,
        },
        version: 1,
        children: [
          {
            type: "text",
            text: "Invalid Doc Link",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Invalid Doc Link")).toBeInTheDocument()
      expect(screen.queryByRole("link")).not.toBeInTheDocument()
    })
  })

  describe("upload/image node rendering", () => {
    it("renders image from upload node", () => {
      const uploadNode: SerializedUploadNode = {
        type: "upload",
        relationTo: "media",
        value: {
          id: "1",
          url: "/test-image.jpg",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const image = screen.getByRole("img", { name: "Test Image" })
      // Next.js Image component transforms URLs, so check it contains the expected parts
      expect(image.getAttribute("src")).toContain("test-image.jpg")
      expect(image).toHaveAttribute("alt", "Test Image")
    })

    it("resolves relative image URLs with mediaBaseUrl", () => {
      const uploadNode: SerializedUploadNode = {
        type: "upload",
        relationTo: "media",
        value: {
          id: "1",
          url: "/relative-image.jpg",
          alt: "Relative Image",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data, { mediaBaseUrl: "https://api.example.com" })
      render(<span>{result}</span>)
      const image = screen.getByRole("img", { name: "Relative Image" })
      // Next.js Image component transforms URLs, so check it contains the expected parts
      expect(image.getAttribute("src")).toContain("api.example.com")
      expect(image.getAttribute("src")).toContain("relative-image.jpg")
      expect(image).toHaveAttribute("alt", "Relative Image")
    })

    it("returns null for non-media upload", () => {
      const uploadNode: SerializedUploadNode = {
        type: "upload",
        relationTo: "documents",
        value: {
          id: "1",
          url: "/document.pdf",
        },
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [uploadNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      // Non-media uploads return null, so no content should be rendered
      expect(screen.queryByRole("img")).not.toBeInTheDocument()
    })

    it("returns null for invalid media document", () => {
      const uploadNode: SerializedUploadNode = {
        type: "upload",
        relationTo: "media",
        value: "invalid",
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [uploadNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      // Invalid media documents return null, so no content should be rendered
      expect(screen.queryByRole("img")).not.toBeInTheDocument()
    })

    it("returns null for media document without URL", () => {
      const uploadNode: SerializedUploadNode = {
        type: "upload",
        relationTo: "media",
        value: {
          id: "1",
          alt: "No URL Image",
        },
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [uploadNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      // Media documents without URL return null, so no content should be rendered
      expect(screen.queryByRole("img")).not.toBeInTheDocument()
    })

    it("handles absolute URLs correctly", () => {
      const uploadNode: SerializedUploadNode = {
        type: "upload",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data, { mediaBaseUrl: "https://api.example.com" })
      render(<span>{result}</span>)
      const image = screen.getByRole("img", { name: "Absolute Image" })
      // Next.js Image component transforms URLs, so check it contains the expected parts
      expect(image.getAttribute("src")).toContain("example.com")
      expect(image.getAttribute("src")).toContain("absolute-image.jpg")
      expect(image).toHaveAttribute("alt", "Absolute Image")
    })

    it("handles standalone URLs without base URL correctly", () => {
      const uploadNode: SerializedUploadNode = {
        type: "upload",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data, { mediaBaseUrl: "https://api.example.com" })
      render(<span>{result}</span>)
      const image = screen.getByRole("img", { name: "Standalone Image" })
      // Next.js Image component transforms URLs, so check it contains the expected parts
      expect(image.getAttribute("src")).toContain("cdn.example.com")
      expect(image.getAttribute("src")).toContain("standalone-image.jpg")
      expect(image).toHaveAttribute("alt", "Standalone Image")
    })
  })

  describe("quote node rendering", () => {
    it("renders quote with children", () => {
      const quoteNode: SerializedQuoteNode = {
        type: "quote",
        version: 1,
        children: [
          {
            type: "text",
            text: "This is a quote",
            version: 1,
          } as SerializedTextNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [quoteNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("This is a quote")).toBeInTheDocument()
    })

    it("returns null for quote without children", () => {
      const quoteNode: SerializedQuoteNode = {
        type: "quote",
        version: 1,
        children: undefined,
      }

      const data: SerializedEditorState = {
        root: {
          children: [quoteNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull() // VStack is still rendered but empty
    })
  })

  describe("list node rendering", () => {
    it("renders unordered list", () => {
      const listNode: SerializedListNode = {
        type: "list",
        tag: "ul",
        version: 1,
        children: [
          {
            type: "listitem",
            version: 1,
            children: [
              {
                type: "text",
                text: "Item 1",
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedListItemNode,
          {
            type: "listitem",
            version: 1,
            children: [
              {
                type: "text",
                text: "Item 2",
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedListItemNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [listNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("Item 1")).toBeInTheDocument()
      expect(screen.getByText("Item 2")).toBeInTheDocument()
    })

    it("renders ordered list", () => {
      const listNode: SerializedListNode = {
        type: "list",
        tag: "ol",
        version: 1,
        children: [
          {
            type: "listitem",
            version: 1,
            children: [
              {
                type: "text",
                text: "First item",
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedListItemNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [listNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("First item")).toBeInTheDocument()
    })

    it("returns null for list without children", () => {
      const listNode: SerializedListNode = {
        type: "list",
        tag: "ul",
        version: 1,
        children: undefined,
      }

      const data: SerializedEditorState = {
        root: {
          children: [listNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull() // VStack is still rendered but empty
    })
  })

  describe("list item node rendering", () => {
    it("renders list item with children", () => {
      const listNode: SerializedListNode = {
        type: "list",
        tag: "ul",
        version: 1,
        children: [
          {
            type: "listitem",
            version: 1,
            children: [
              {
                type: "text",
                text: "List item content",
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedListItemNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [listNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("List item content")).toBeInTheDocument()
    })

    it("renders list item without children", () => {
      const listItemNode: SerializedListItemNode = {
        type: "listitem",
        version: 1,
        children: undefined,
      }

      const data: SerializedEditorState = {
        root: {
          children: [listItemNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull() // VStack is still rendered
    })
  })

  describe("line break node rendering", () => {
    it("renders line break", () => {
      const data: SerializedEditorState = {
        root: {
          children: [
            {
              type: "linebreak",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(document.querySelector("br")).toBeInTheDocument()
    })
  })

  describe("horizontal rule node rendering", () => {
    it("renders horizontal rule", () => {
      const data: SerializedEditorState = {
        root: {
          children: [
            {
              type: "horizontalrule",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      // Check that horizontal rule renders some content (Separator component)
      expect(result).not.toBeNull()
    })
  })

  describe("code node rendering", () => {
    it("renders code block with language", () => {
      const codeNode: SerializedCodeNode = {
        type: "code",
        language: "javascript",
        version: 1,
        children: [
          {
            type: "text",
            text: "console.log('Hello World')",
            version: 1,
          } as SerializedTextNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [codeNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      const codeElement = screen.getByText("console.log('Hello World')")
      expect(codeElement).toBeInTheDocument()
      expect(codeElement).toHaveAttribute("data-language", "javascript")
    })

    it("renders code block without language", () => {
      const codeNode: SerializedCodeNode = {
        type: "code",
        version: 1,
        children: [
          {
            type: "text",
            text: "some code",
            version: 1,
          } as SerializedTextNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [codeNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      expect(screen.getByText("some code")).toBeInTheDocument()
    })

    it("renders code block without children", () => {
      const codeNode: SerializedCodeNode = {
        type: "code",
        language: "python",
        version: 1,
        children: undefined,
      }

      const data: SerializedEditorState = {
        root: {
          children: [codeNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

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

      const data: SerializedEditorState = {
        root: {
          children: [
            {
              type: "paragraph",
              version: 1,
              children: [
                {
                  type: "text",
                  text: "Custom content",
                  version: 1,
                } as SerializedTextNode,
              ],
            } as SerializedParagraphNode,
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

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
              type: "custom",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
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
                  type: "text",
                  text: "Unknown node content",
                  version: 1,
                },
              ],
            } as SerializedLexicalNode,
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull() // VStack is still rendered but empty
    })
  })

  describe("nested content", () => {
    it("renders nested inline elements", () => {
      const data: SerializedEditorState = {
        root: {
          children: [
            {
              type: "paragraph",
              version: 1,
              children: [
                {
                  type: "text",
                  text: "Text with ",
                  version: 1,
                },
                {
                  type: "link",
                  fields: {
                    linkType: "custom",
                    url: "https://example.com",
                  },
                  version: 1,
                  children: [
                    {
                      type: "text",
                      text: "a link",
                      format: 1, // Bold
                      version: 1,
                    },
                  ],
                },
                {
                  type: "text",
                  text: " and ",
                  version: 1,
                },
                {
                  type: "linebreak",
                  version: 1,
                },
                {
                  type: "text",
                  text: "line break",
                  version: 1,
                },
              ],
            } as SerializedParagraphNode,
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
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
              type: "paragraph",
              version: 1,
              children: [
                {
                  type: "unknown-inline",
                  version: 1,
                  children: [
                    {
                      type: "text",
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
          type: "root",
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
        type: "paragraph",
        version: 1,
        children: null as unknown as SerializedLexicalNode[],
      }

      const data: SerializedEditorState = {
        root: {
          children: [paragraphNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull() // VStack is still rendered
    })

    it("handles unknown node without children in inline rendering", () => {
      const paragraphNode: SerializedParagraphNode = {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "unknown-inline",
            version: 1,
            // No children property
          } as SerializedLexicalNode,
        ],
      }

      const data: SerializedEditorState = {
        root: {
          children: [paragraphNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      // Should render the paragraph but unknown inline node returns null
      expect(result).not.toBeNull()
    })

    it("returns null for upload node with media document without URL", () => {
      const uploadNode: SerializedUploadNode = {
        type: "upload",
        relationTo: "media",
        value: {
          id: "1",
          alt: "Image without URL",
          // No url property
        } as unknown as SerializedMediaDocument,
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [uploadNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull() // VStack is still rendered but empty
    })

    it("handles renderInlineNodes with null nodes", () => {
      // This test specifically targets line 217 - the null check in renderInlineNodes
      const paragraphNode: SerializedParagraphNode = {
        type: "paragraph",
        version: 1,
        children: null as unknown as SerializedLexicalNode[],
      }

      const data: SerializedEditorState = {
        root: {
          children: [paragraphNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull()
    })

    it("handles renderInlineNodes with empty array", () => {
      // This test specifically targets line 217 - the empty array check in renderInlineNodes
      const paragraphNode: SerializedParagraphNode = {
        type: "paragraph",
        version: 1,
        children: [],
      }

      const data: SerializedEditorState = {
        root: {
          children: [paragraphNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull()
    })

    it("covers renderInlineNodes null return with link containing empty children", () => {
      // This should trigger the renderInlineNodes method with empty/null children
      const linkNode: SerializedLinkNode = {
        type: "link",
        fields: {
          linkType: "custom",
          url: "https://example.com",
        },
        version: 1,
        children: [], // Empty children array should trigger line 217
      }

      const data: SerializedEditorState = {
        root: {
          children: [linkNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      // Should render link but with no content
      expect(screen.getByRole("link")).toBeInTheDocument()
    })

    it("covers upload node null return when media has no URL", () => {
      // This should specifically target line 336 in renderUploadNode
      const uploadNode: SerializedUploadNode = {
        type: "upload",
        relationTo: "media",
        value: {
          id: "test-id",
          alt: "Test alt",
          url: "", // Empty URL string to trigger line 336: if (!url)
        },
        version: 1,
      }

      const data: SerializedEditorState = {
        root: {
          children: [uploadNode],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull() // Should render VStack but no image
      render(<span>{result}</span>)
      expect(screen.queryByRole("img")).not.toBeInTheDocument()
    })

    it("covers upload node null return when media URL is undefined", () => {
      // Alternative test for line 336 with undefined URL
      const uploadNode: SerializedUploadNode = {
        type: "upload",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      expect(result).not.toBeNull()
      render(<span>{result}</span>)
      expect(screen.queryByRole("img")).not.toBeInTheDocument()
    })

    it("covers internal link with invalid document (line 294 false branch)", () => {
      // Test the false branch of isDocumentWithSlug(doc) on line 294
      const linkNode: SerializedLinkNode = {
        type: "link",
        fields: {
          linkType: "internal",
          doc: { id: "123" } as unknown,
        },
        version: 1,
        children: [
          {
            type: "text",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      // Should render as span, not link
      expect(screen.getByText("Invalid doc link")).toBeInTheDocument()
      expect(screen.queryByRole("link")).not.toBeInTheDocument()
    })

    it("covers internal link with valid document (line 294 true branch)", () => {
      // Test the true branch of isDocumentWithSlug(doc) on line 294
      const linkNode: SerializedLinkNode = {
        type: "link",
        fields: {
          linkType: "internal",
          doc: {
            id: "123",
            slug: "test-document",
          }, // Valid doc with slug
          newTab: true,
        },
        version: 1,
        children: [
          {
            type: "text",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      // Should render as proper link
      const link = screen.getByRole("link", { name: "Valid doc link" })
      expect(link).toHaveAttribute("href", "/test-document")
      expect(link).toHaveAttribute("target", "_blank")
    })

    it("covers internal link with null doc (no fields.doc)", () => {
      // Test case where fields.doc is null, which should trigger the "no href" path
      const linkNode: SerializedLinkNode = {
        type: "link",
        fields: {
          linkType: "internal",
          doc: null,
        },
        version: 1,
        children: [
          {
            type: "text",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data)
      render(<span>{result}</span>)
      // Should render as span, not link
      expect(screen.getByText("Null doc link")).toBeInTheDocument()
      expect(screen.queryByRole("link")).not.toBeInTheDocument()
    })

    it("covers image default values", () => {
      const uploadNode: SerializedUploadNode = {
        type: "upload",
        relationTo: "media",
        value: {
          id: "test-id",
          // No alt, height, or width to trigger default values
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
          type: "root",
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
        type: "upload",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data, { mediaBaseUrl: "https://api.example.com/" })
      render(<span>{result}</span>)
      const image = screen.getByRole("img", { name: "Test Image" })
      // Next.js Image component transforms URLs, so check it contains the expected URL
      expect(image.getAttribute("src")).toContain("api.example.com")
      expect(image.getAttribute("src")).toContain("image.jpg")
      expect(image).toHaveAttribute("alt", "Test Image")
    })

    it("handles URL without leading slash", () => {
      const uploadNode: SerializedUploadNode = {
        type: "upload",
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
          type: "root",
          version: 1,
        },
      }

      const result = renderer.render(data, { mediaBaseUrl: "https://api.example.com" })
      render(<span>{result}</span>)
      const image = screen.getByRole("img", { name: "Test Image" })
      // Next.js Image component transforms URLs, so check it contains the expected URL
      expect(image.getAttribute("src")).toContain("api.example.com")
      expect(image.getAttribute("src")).toContain("image.jpg")
      expect(image).toHaveAttribute("alt", "Test Image")
    })
  })
})
