import {
  emptyListNode,
  orderedListNode,
  unorderedListNode,
} from "@/test-config/mocks/RichText.mock"
import { render, screen } from "@testing-library/react"
import { renderListNode } from "./list"

describe("renderListNode", () => {
  it("should render an unordered list", () => {
    const renderNode = vi.fn((node) => <li key={node.children[0].text}>{node.children[0].text}</li>)
    const options = {}

    render(renderListNode(unorderedListNode, "test-key", options, renderNode))

    const list = screen.getByRole("list")
    expect(list.tagName).toBe("UL")
    expect(screen.getByText("List item 1")).toBeInTheDocument()
    expect(screen.getByText("List item 2")).toBeInTheDocument()
    expect(renderNode).toHaveBeenCalledTimes(2)
    if (unorderedListNode.children) {
      expect(renderNode).toHaveBeenCalledWith(unorderedListNode.children[0], options)
      expect(renderNode).toHaveBeenCalledWith(unorderedListNode.children[1], options)
    }
  })

  it("should render an ordered list", () => {
    const renderNode = vi.fn((node) => <li key={node.children[0].text}>{node.children[0].text}</li>)
    const options = {}

    render(renderListNode(orderedListNode, "test-key", options, renderNode))

    const list = screen.getByRole("list")
    expect(list.tagName).toBe("OL")
    expect(screen.getByText("First item")).toBeInTheDocument()
    expect(screen.getByText("Second item")).toBeInTheDocument()
    expect(renderNode).toHaveBeenCalledTimes(2)
    if (orderedListNode.children) {
      expect(renderNode).toHaveBeenCalledWith(orderedListNode.children[0], options)
      expect(renderNode).toHaveBeenCalledWith(orderedListNode.children[1], options)
    }
  })

  it("should return null for an empty list", () => {
    const renderNode = vi.fn()
    const options = {}

    const { container } = render(renderListNode(emptyListNode, "test-key", options, renderNode))

    expect(container).toBeEmptyDOMElement()
    expect(renderNode).not.toHaveBeenCalled()
  })
})
