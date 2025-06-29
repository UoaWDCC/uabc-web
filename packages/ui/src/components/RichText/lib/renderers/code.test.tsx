import {
  createCodeNodeCustom,
  emptyCodeNode,
  javascriptCodeNode,
  noLanguageCodeNode,
} from "@/test-config/mocks/RichText.mock"
import { render, screen } from "@testing-library/react"
import { renderCodeNode } from "./code"

describe("renderCodeNode", () => {
  it("should render a code block with language", () => {
    const options = {}
    render(renderCodeNode(javascriptCodeNode, options))

    const codeBlock = screen.getByText("console.log('Hello World')")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveAttribute("data-language", "javascript")
  })

  it("should render a code block without language", () => {
    const options = {}
    render(renderCodeNode(noLanguageCodeNode, options))

    const codeBlock = screen.getByText("some code")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).not.toHaveAttribute("data-language")
  })

  it("should render an empty code block", () => {
    const options = {}
    render(renderCodeNode(emptyCodeNode, options))

    const codeBlock = screen.getByRole("code")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toBeEmptyDOMElement()
  })

  it("should render an empty code block when children is undefined", () => {
    const options = {}
    const codeNodeWithNoChildren = createCodeNodeCustom(undefined, "typescript")
    render(renderCodeNode(codeNodeWithNoChildren, options))

    const codeBlock = screen.getByRole("code")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toBeEmptyDOMElement()
    expect(codeBlock).toHaveAttribute("data-language", "typescript")
  })
})
