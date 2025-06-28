import {
  basicEditorState,
  complexEditorState,
  emptyEditorState,
} from "@/test-config/RichTextRenderer.mock"
import { render, screen } from "@/test-utils"
import { isValidElement } from "react"
import { RichText } from "./RichText"
import * as RichTextModule from "./index"
import type {
  SerializedEditorState,
  SerializedHeadingNode,
  SerializedLexicalNode,
  SerializedLinkNode,
  SerializedParagraphNode,
  SerializedTextNode,
  SerializedUploadNode,
} from "./lib/types"

describe("<RichText />", () => {
  it("should re-export the RichText component and check if RichText exists", () => {
    expect(RichTextModule.RichText).toBeDefined()
    expect(RichTextModule.default).toBeDefined()
    expect(isValidElement(<RichTextModule.RichText data={basicEditorState} />)).toBeTruthy()
  })

  it("renders basic rich text content", () => {
    render(<RichText data={basicEditorState} />)
    expect(screen.getByText("Plain text")).toBeInTheDocument()
  })

  it("renders complex rich text content with all node types", () => {
    render(<RichText data={complexEditorState} />)

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Main Heading")

    expect(screen.getByText("This is")).toBeInTheDocument()
    expect(screen.getByText("Bold text")).toBeInTheDocument()
    expect(screen.getByText("and")).toBeInTheDocument()
    expect(screen.getByText("Italic text")).toBeInTheDocument()

    const link = screen.getByRole("link", { name: "External Link" })
    expect(link).toHaveAttribute("href", "https://example.com")
    expect(link).toHaveAttribute("target", "_blank")

    const image = screen.getByRole("img", { name: "Test Image" })
    expect(image.getAttribute("src")).toContain("test-image.jpg")
    expect(image).toHaveAttribute("alt", "Test Image")

    expect(screen.getByText("List item 1")).toBeInTheDocument()
    expect(screen.getByText("List item 2")).toBeInTheDocument()

    expect(screen.getByText("This is a quote")).toBeInTheDocument()

    expect(screen.getByText("console.log('Hello World')")).toBeInTheDocument()
  })

  it("returns fallback when data is null or undefined", () => {
    const { rerender } = render(
      <RichText data={null as unknown as SerializedEditorState} fallback="No content" />,
    )
    expect(screen.getByText("No content")).toBeInTheDocument()

    rerender(
      <RichText
        data={undefined as unknown as SerializedEditorState}
        fallback="No content available"
      />,
    )
    expect(screen.getByText("No content available")).toBeInTheDocument()
  })

  it("returns fallback when data has no children", () => {
    render(<RichText data={emptyEditorState} fallback="Empty content" />)
    expect(screen.getByText("Empty content")).toBeInTheDocument()
  })

  it("renders with custom text props", () => {
    render(<RichText data={basicEditorState} textProps={{ color: "red.500", fontSize: "lg" }} />)

    const textElement = screen.getByText("Plain text")
    expect(textElement).toHaveStyle({ color: "var(--ui-colors-red-500)" })
  })

  it("renders with custom heading props", () => {
    const headingData: SerializedEditorState = {
      root: {
        children: [
          {
            type: "heading",
            tag: "h2",
            version: 1,
            children: [
              {
                type: "text",
                text: "Custom Heading",
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedHeadingNode,
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }

    render(<RichText data={headingData} headingProps={{ color: "blue.500", fontWeight: "bold" }} />)

    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading).toHaveStyle({ color: "var(--ui-colors-blue-500)" })
  })

  it("renders with custom link props", () => {
    const linkData: SerializedEditorState = {
      root: {
        children: [
          {
            type: "link",
            fields: {
              linkType: "custom",
              url: "https://test.com",
            },
            version: 1,
            children: [
              {
                type: "text",
                text: "Test Link",
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedLinkNode,
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }

    render(
      <RichText data={linkData} linkProps={{ color: "purple.500", textDecoration: "underline" }} />,
    )

    const link = screen.getByRole("link", { name: "Test Link" })
    expect(link).toHaveStyle({ color: "var(--ui-colors-purple-500)" })
  })

  it("renders internal link with document slug", () => {
    const internalLinkData: SerializedEditorState = {
      root: {
        children: [
          {
            type: "link",
            fields: {
              linkType: "internal",
              doc: {
                id: "document-123",
                slug: "example-page",
                title: "Example Page",
              },
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
          } as SerializedLinkNode,
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }

    render(<RichText data={internalLinkData} />)

    const link = screen.getByRole("link", { name: "Internal Link" })
    expect(link).toHaveAttribute("href", "/example-page")
    expect(link).not.toHaveAttribute("target", "_blank")
  })

  it("renders internal link with document slug and newTab true", () => {
    const internalLinkWithNewTabData: SerializedEditorState = {
      root: {
        children: [
          {
            type: "link",
            fields: {
              linkType: "internal",
              doc: {
                id: "document-456",
                slug: "new-tab-page",
                title: "New Tab Page",
              },
              newTab: true,
            },
            version: 1,
            children: [
              {
                type: "text",
                text: "Internal Link New Tab",
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedLinkNode,
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }

    render(<RichText data={internalLinkWithNewTabData} />)

    const link = screen.getByRole("link", { name: "Internal Link New Tab" })
    expect(link).toHaveAttribute("href", "/new-tab-page")
    expect(link).toHaveAttribute("target", "_blank")
  })

  it("renders internal link with minimal valid document", () => {
    const minimalValidDocData: SerializedEditorState = {
      root: {
        children: [
          {
            type: "link",
            fields: {
              linkType: "internal",
              doc: {
                slug: "minimal-page",
              },
            },
            version: 1,
            children: [
              {
                type: "text",
                text: "Minimal Valid Link",
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedLinkNode,
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }

    render(<RichText data={minimalValidDocData} />)

    const link = screen.getByRole("link", { name: "Minimal Valid Link" })
    expect(link).toHaveAttribute("href", "/minimal-page")
    expect(link).not.toHaveAttribute("target", "_blank")
  })

  it("renders internal link with invalid document as span", () => {
    const internalLinkWithInvalidDocData: SerializedEditorState = {
      root: {
        children: [
          {
            type: "link",
            fields: {
              linkType: "internal",
              doc: {
                id: "document-789",
                // Missing slug property - makes it invalid per DocumentWithSlugSchema
                title: "Invalid Document",
              },
              newTab: false,
            },
            version: 1,
            children: [
              {
                type: "text",
                text: "Invalid Internal Link",
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedLinkNode,
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }

    render(<RichText data={internalLinkWithInvalidDocData} />)

    // Should render as span, not a link since document doesn't have slug
    const textElement = screen.getByText("Invalid Internal Link")
    expect(textElement.tagName.toLowerCase()).toBe("span")
    expect(textElement).not.toHaveAttribute("href")
  })

  it("renders internal link with no document as span", () => {
    const internalLinkWithNoDocData: SerializedEditorState = {
      root: {
        children: [
          {
            type: "link",
            fields: {
              linkType: "internal",
              // No doc property at all
              newTab: false,
            },
            version: 1,
            children: [
              {
                type: "text",
                text: "No Document Link",
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedLinkNode,
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }

    render(<RichText data={internalLinkWithNoDocData} />)

    // Should render as span, not a link since no document provided
    const textElement = screen.getByText("No Document Link")
    expect(textElement.tagName.toLowerCase()).toBe("span")
    expect(textElement).not.toHaveAttribute("href")
  })

  it("renders internal link with string document as span", () => {
    const internalLinkWithStringDocData: SerializedEditorState = {
      root: {
        children: [
          {
            type: "link",
            fields: {
              linkType: "internal",
              doc: "some-document-id", // String instead of object - valid per schema but fails isDocumentWithSlug
              newTab: false,
            },
            version: 1,
            children: [
              {
                type: "text",
                text: "String Document Link",
                version: 1,
              } as SerializedTextNode,
            ],
          } as SerializedLinkNode,
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }

    render(<RichText data={internalLinkWithStringDocData} />)

    // Should render as span, not a link since document is string not object with slug
    const textElement = screen.getByText("String Document Link")
    expect(textElement.tagName.toLowerCase()).toBe("span")
    expect(textElement).not.toHaveAttribute("href")
  })

  it("renders with custom image props", () => {
    const imageData: SerializedEditorState = {
      root: {
        children: [
          {
            type: "upload",
            relationTo: "media",
            value: {
              id: "1",
              url: "/custom-image.jpg",
              alt: "Custom Image",
              width: 400,
              height: 300,
            },
            version: 1,
          } as SerializedUploadNode,
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }

    render(<RichText data={imageData} imageProps={{ borderRadius: "md", boxShadow: "lg" }} />)

    const image = screen.getByRole("img", { name: "Custom Image" })
    expect(image).toHaveStyle({ borderRadius: "var(--ui-radii-md)" })
  })

  it("renders with custom code props", () => {
    const codeData: SerializedEditorState = {
      root: {
        children: [
          {
            type: "paragraph",
            version: 1,
            children: [
              {
                type: "text",
                text: "inline code",
                format: 16, // Code format
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

    render(<RichText codeProps={{ bg: "gray.100", color: "red.500" }} data={codeData} />)

    const codeElement = screen.getByText("inline code")

    expect(codeElement.tagName.toLowerCase()).toBe("code")
  })

  it("resolves media URLs with mediaBaseUrl", () => {
    const imageData: SerializedEditorState = {
      root: {
        children: [
          {
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
          } as SerializedUploadNode,
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }

    render(<RichText data={imageData} mediaBaseUrl="https://api.example.com" />)

    const image = screen.getByRole("img", { name: "Relative Image" })
    expect(image.getAttribute("src")).toContain("api.example.com")
    expect(image.getAttribute("src")).toContain("relative-image.jpg")
  })

  it("renders with custom components", () => {
    const CustomParagraph = ({
      children,
    }: { node: SerializedLexicalNode; children?: React.ReactNode }) => (
      <div data-testid="custom-paragraph">{children}</div>
    )

    render(
      <RichText
        customComponents={{
          paragraph: CustomParagraph,
        }}
        data={basicEditorState}
      />,
    )

    expect(screen.getByTestId("custom-paragraph")).toBeInTheDocument()
    expect(screen.getByText("Plain text")).toBeInTheDocument()
  })

  it("memoizes content properly", () => {
    const { rerender } = render(<RichText data={basicEditorState} />)

    const firstRender = screen.getByText("Plain text")

    rerender(<RichText data={basicEditorState} />)

    const secondRender = screen.getByText("Plain text")
    expect(firstRender).toBe(secondRender)
  })

  it("updates content when data changes", () => {
    const newData: SerializedEditorState = {
      root: {
        children: [
          {
            type: "paragraph",
            version: 1,
            children: [
              {
                type: "text",
                text: "Updated Content",
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

    const { rerender } = render(<RichText data={basicEditorState} />)
    expect(screen.getByText("Plain text")).toBeInTheDocument()

    rerender(<RichText data={newData} />)
    expect(screen.getByText("Updated Content")).toBeInTheDocument()
    expect(screen.queryByText("Plain text")).not.toBeInTheDocument()
  })

  it("has correct display name", () => {
    expect(RichText.displayName).toBe("RichText")
  })

  it("renders null when data.root is missing", () => {
    const invalidData = { root: null } as unknown as SerializedEditorState
    render(<RichText data={invalidData} fallback="Fallback content" />)
    expect(screen.getByText("Fallback content")).toBeInTheDocument()
  })

  it("renders null when renderer returns null", () => {
    const emptyRootData: SerializedEditorState = {
      root: {
        children: null as unknown as SerializedLexicalNode[],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }

    render(<RichText data={emptyRootData} fallback="No content rendered" />)
    expect(screen.getByText("No content rendered")).toBeInTheDocument()
  })
})
