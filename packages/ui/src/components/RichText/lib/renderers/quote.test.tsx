import { render, screen } from "@testing-library/react"
import { emptyQuoteNode, simpleQuoteNode } from "@/test-config/mocks/RichText.mock"
import { renderQuoteNode } from "./quote"

describe("renderQuoteNode", () => {
  it("should render a quote with text", () => {
    const renderInlineNodes = vi.fn().mockReturnValue("This is a quote")
    const options = {}

    render(renderQuoteNode(simpleQuoteNode, "test-key", options, renderInlineNodes))

    const quote = screen.getByText("This is a quote")
    expect(quote.tagName).toBe("BLOCKQUOTE")
    expect(renderInlineNodes).toHaveBeenCalledWith(simpleQuoteNode.children, options)
  })

  it("should return null for an empty quote", () => {
    const renderInlineNodes = vi.fn()
    const options = {}

    const { container } = render(
      renderQuoteNode(emptyQuoteNode, "test-key", options, renderInlineNodes),
    )

    expect(container).toBeEmptyDOMElement()
    expect(renderInlineNodes).not.toHaveBeenCalled()
  })
})
