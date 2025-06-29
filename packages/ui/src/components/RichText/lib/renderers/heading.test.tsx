import { h1HeadingNode, h2HeadingNode } from "@/test-config/mocks/RichText.mock"
import { render, screen } from "@testing-library/react"
import type { HeadingProps } from "@yamada-ui/react"
import { renderHeadingNode } from "./heading"

describe("renderHeadingNode", () => {
  it("should render an h1 heading", () => {
    const renderInlineNodes = vi.fn().mockReturnValue("Main Heading")
    const options = { headingProps: {} }

    render(renderHeadingNode(h1HeadingNode, options, renderInlineNodes))

    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent("Main Heading")
    expect(renderInlineNodes).toHaveBeenCalledWith(h1HeadingNode.children, options)
  })

  it("should render an h2 heading", () => {
    const renderInlineNodes = vi.fn().mockReturnValue("Sub Heading")
    const options = { headingProps: {} }

    render(renderHeadingNode(h2HeadingNode, options, renderInlineNodes))

    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent("Sub Heading")
    expect(renderInlineNodes).toHaveBeenCalledWith(h2HeadingNode.children, options)
  })

  it("should pass headingProps to the Heading component", () => {
    const renderInlineNodes = vi.fn()
    const options = { headingProps: { "data-testid": "custom-heading" } as HeadingProps }

    render(renderHeadingNode(h1HeadingNode, options, renderInlineNodes))

    const heading = screen.getByTestId("custom-heading")
    expect(heading).toBeInTheDocument()
  })
})
