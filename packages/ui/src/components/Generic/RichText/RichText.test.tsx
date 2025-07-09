import type { SerializedEditorState } from "@repo/shared"
import { basicEditorState, complexEditorState } from "@repo/ui/test-config/mocks/RichText.mock"
import { render, screen } from "@testing-library/react"
import type React from "react"
import { NodeType } from "./lib/constants"
import { RichText } from "./RichText"

describe("RichText", () => {
  it("should render fallback for null or empty data", () => {
    const fallbackText = "No content"
    // biome-ignore lint/suspicious/noExplicitAny: for testing
    const { rerender } = render(<RichText data={null as any} fallback={fallbackText} />)
    expect(screen.getByText(fallbackText)).toBeInTheDocument()

    // biome-ignore lint/suspicious/noExplicitAny: for testing
    rerender(<RichText data={undefined as any} fallback={fallbackText} />)
    expect(screen.getByText(fallbackText)).toBeInTheDocument()
  })

  it("should render fallback for empty root children", () => {
    const fallbackText = "No content"
    const emptyData = {
      root: {
        children: [],
        direction: null,
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    } as SerializedEditorState
    render(<RichText data={emptyData} fallback={fallbackText} />)
    expect(screen.getByText(fallbackText)).toBeInTheDocument()
  })

  it("should render a basic paragraph", () => {
    render(<RichText data={basicEditorState} />)
    expect(screen.getByText("Plain text")).toBeInTheDocument()
  })

  it("should render complex rich text content", () => {
    render(<RichText data={complexEditorState} />)

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

    const codeBlock = screen.getByText("console.log('Hello World')")
    expect(codeBlock.closest("code")).toBeInTheDocument()
  })

  it("should pass props to renderers", () => {
    render(
      <RichText
        data={complexEditorState}
        headingProps={{ color: "red" }}
        textProps={{ color: "blue" }}
      />,
    )

    const heading = screen.getByRole("heading", { name: "Main Heading" })
    expect(heading).toHaveStyle("color: rgb(255, 0, 0)")

    const text = screen.getByText("This is")
    expect(text).toHaveStyle("color: rgb(0, 0, 255)")
  })

  it("should use custom components when provided", () => {
    const customParagraphText = "Custom Paragraph!"
    const CustomParagraph = ({ children }: { children?: React.ReactNode }) => (
      <p data-testid="custom-paragraph">
        {customParagraphText}
        {children}
      </p>
    )

    render(
      <RichText
        customComponents={{
          [NodeType.PARAGRAPH]: CustomParagraph,
        }}
        data={basicEditorState}
      />,
    )

    expect(screen.getByTestId("custom-paragraph")).toBeInTheDocument()
    expect(screen.getByText(customParagraphText)).toBeInTheDocument()
    expect(screen.getByText("Plain text")).toBeInTheDocument()
  })
})
