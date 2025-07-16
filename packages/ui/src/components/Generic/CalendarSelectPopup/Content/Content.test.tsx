import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { Content } from "./Content"

describe("<Content />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<Content />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(Content.displayName).toBe("Content")
  })

  it("should render children", () => {
    render(
      <Content data-testid="custom-content">
        <div>Test content</div>
        <div>Second child</div>
      </Content>,
    )

    const content = screen.getByTestId("custom-content")
    expect(content).toBeInTheDocument()
    expect(screen.getByText("Test content")).toBeInTheDocument()
    expect(screen.getByText("Second child")).toBeInTheDocument()
  })
})
