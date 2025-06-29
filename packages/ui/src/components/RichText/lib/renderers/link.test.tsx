import {
  createInternalLinkWithInvalidDoc,
  createLinkNodeNoUrl,
  externalLinkNode,
  internalLinkNode,
  internalLinkWithLinkDocNode,
  invalidLinkNode,
} from "@/test-config/mocks/RichText.mock"
import { render, screen } from "@testing-library/react"
import type { LinkProps } from "@yamada-ui/react"
import { renderLinkNode } from "./link"

describe("renderLinkNode", () => {
  const renderInlineNodes = vi.fn().mockImplementation((nodes) => {
    if (nodes && nodes.length > 0) {
      return nodes[0].text
    }
    return ""
  })

  beforeEach(() => {
    renderInlineNodes.mockClear()
  })

  it("should render an external link", () => {
    const options = {}
    render(renderLinkNode(externalLinkNode, "test-key", options, renderInlineNodes))

    const link = screen.getByRole("link", { name: "External Link" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "https://example.com")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("should render an internal link", () => {
    const options = {}
    render(renderLinkNode(internalLinkNode, "test-key", options, renderInlineNodes))

    const link = screen.getByRole("link", { name: "Internal Link" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test-page")
    expect(link).not.toHaveAttribute("target")
  })

  it("should render an internal link with a LinkDoc", () => {
    const options = {}
    render(renderLinkNode(internalLinkWithLinkDocNode, "test-key", options, renderInlineNodes))

    const link = screen.getByRole("link", { name: "Internal Link with LinkDoc" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test-page-link-doc")
    expect(link).not.toHaveAttribute("target")
  })

  it("should render an external link with newTab false", () => {
    const options = {}
    const externalLinkNodeNoNewTab = {
      ...externalLinkNode,
      fields: { ...externalLinkNode.fields, newTab: false },
    }
    render(renderLinkNode(externalLinkNodeNoNewTab, "test-key", options, renderInlineNodes))

    const link = screen.getByRole("link", { name: "External Link" })
    expect(link).toBeInTheDocument()
    expect(link).not.toHaveAttribute("target")
  })

  it("should render an internal link with newTab true", () => {
    const options = {}
    const internalLinkNodeNewTab = {
      ...internalLinkNode,
      fields: { ...internalLinkNode.fields, newTab: true },
    }
    render(renderLinkNode(internalLinkNodeNewTab, "test-key", options, renderInlineNodes))

    const link = screen.getByRole("link", { name: "Internal Link" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("should render plain text for an invalid link", () => {
    const options = {}
    render(renderLinkNode(invalidLinkNode, "test-key", options, renderInlineNodes))

    const text = screen.getByText("Invalid Link")
    expect(text).toBeInTheDocument()
    expect(text.tagName).toBe("SPAN")
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })

  it("should render plain text for an internal link with an invalid doc", () => {
    const options = {}
    const internalLinkInvalidDocNode = createInternalLinkWithInvalidDoc()
    render(renderLinkNode(internalLinkInvalidDocNode, "test-key", options, renderInlineNodes))

    const text = screen.getByText("Invalid Internal Link")
    expect(text).toBeInTheDocument()
    expect(text.tagName).toBe("SPAN")
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })

  it("should render plain text for a custom link with no URL", () => {
    const options = {}
    const linkNoUrlNode = createLinkNodeNoUrl()
    render(renderLinkNode(linkNoUrlNode, "test-key", options, renderInlineNodes))

    const text = screen.getByText("No URL Link")
    expect(text).toBeInTheDocument()
    expect(text.tagName).toBe("SPAN")
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })

  it("should pass linkProps to the Link component", () => {
    const options = { linkProps: { "data-testid": "custom-link" } as LinkProps }
    render(renderLinkNode(externalLinkNode, "test-key", options, renderInlineNodes))

    const link = screen.getByTestId("custom-link")
    expect(link).toBeInTheDocument()
  })
})
