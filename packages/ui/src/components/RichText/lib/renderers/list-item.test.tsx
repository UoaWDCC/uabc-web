import { render, screen } from "@testing-library/react"
import { DiscList } from "@yamada-ui/react"
import { createListItemNode } from "@/test-config/mocks/RichText.mock"
import { NodeType } from "../constants"
import { renderListItemNode } from "./list-item"

describe("renderListItemNode", () => {
  it("should render a list item with text", () => {
    const renderInlineNodes = vi.fn().mockReturnValue("List item")
    const options = {}
    const listItemNode = createListItemNode([
      { type: NodeType.TEXT, text: "List item", version: 1 },
    ])

    render(
      <DiscList>
        {renderListItemNode(listItemNode, "test-key", options, renderInlineNodes)}
      </DiscList>,
    )

    const listItem = screen.getByRole("listitem")
    expect(listItem).toHaveTextContent("List item")
    expect(renderInlineNodes).toHaveBeenCalledWith(listItemNode.children, options)
  })

  it("should render an empty list item", () => {
    const renderInlineNodes = vi.fn()
    const options = {}
    const emptyListItemNode = createListItemNode()

    render(
      <DiscList>
        {renderListItemNode(emptyListItemNode, "test-key", options, renderInlineNodes)}
      </DiscList>,
    )

    const listItem = screen.getByRole("listitem")
    expect(listItem).toBeEmptyDOMElement()
    expect(renderInlineNodes).not.toHaveBeenCalled()
  })
})
