import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { Body } from "./Body"

describe("<Body />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<Body />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(Body.displayName).toBe("Body")
  })

  it("should render children with custom props", () => {
    render(
      <Body align="center" gap="lg">
        <button type="button">Button 1</button>
        <button type="button">Button 2</button>
        <div>Content</div>
      </Body>,
    )

    expect(screen.getByRole("button", { name: "Button 1" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Button 2" })).toBeInTheDocument()
    expect(screen.getByText("Content")).toBeInTheDocument()
  })
})
