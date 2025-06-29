import { render } from "@testing-library/react"
import { renderHorizontalRuleNode, renderLineBreakNode } from "./misc"

describe("renderLineBreakNode", () => {
  it("should render a br tag", () => {
    const { container } = render(renderLineBreakNode())
    expect(container.querySelector("br")).toBeInTheDocument()
  })
})

describe("renderHorizontalRuleNode", () => {
  it("should render a Separator component", () => {
    const { container } = render(renderHorizontalRuleNode())
    expect(container.querySelector("hr")).toBeInTheDocument()
  })
})
