import { emptyParagraphNode, simpleParagraphNode } from "@/test-config/mocks/RichText.mock"
import { render, screen } from "@testing-library/react"
import type { TextProps } from "@yamada-ui/react"
import { renderParagraphNode } from "./paragraph"

describe("renderParagraphNode", () => {
  it("should render a paragraph with text", () => {
    const renderInlineNodes = vi.fn().mockReturnValue("Plain text")
    const options = { textProps: {} }

    render(renderParagraphNode(simpleParagraphNode, options, renderInlineNodes))

    const paragraph = screen.getByText("Plain text")
    expect(paragraph).toBeInTheDocument()
    expect(renderInlineNodes).toHaveBeenCalledWith(simpleParagraphNode.children, options)
  })

  it("should return null for an empty paragraph", () => {
    const renderInlineNodes = vi.fn()
    const options = { textProps: {} }

    const { container } = render(
      renderParagraphNode(emptyParagraphNode, options, renderInlineNodes),
    )

    expect(container).toBeEmptyDOMElement()
    expect(renderInlineNodes).not.toHaveBeenCalled()
  })

  it("should pass textProps to the Text component", () => {
    const renderInlineNodes = vi.fn()
    const options = { textProps: { "data-testid": "custom-paragraph" } as TextProps }

    render(renderParagraphNode(simpleParagraphNode, options, renderInlineNodes))

    const paragraph = screen.getByTestId("custom-paragraph")
    expect(paragraph).toBeInTheDocument()
  })
})
