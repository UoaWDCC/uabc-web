import { render, screen, TestIcon } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { IconWithText } from "./IconWithText"
import * as IconWithTextModule from "./index"

describe("<IconWithText />", () => {
  it("should re-export the IconWithText component and check if IconWithText exists", () => {
    expect(IconWithTextModule.IconWithText).toBeDefined()
    expect(isValidElement(<IconWithTextModule.IconWithText icon={<TestIcon />} />)).toBeTruthy()
  })

  it("renders the icon", () => {
    render(<IconWithText icon={<TestIcon data-testid="icon" />} label="Test Label" />)
    expect(screen.getByTestId("icon")).toBeInTheDocument()
    expect(screen.getByText("Test Label")).toBeInTheDocument()
  })

  it("renders children instead of label", () => {
    render(
      <IconWithText icon={<TestIcon />}>
        <span data-testid="custom-child">Custom Child</span>
      </IconWithText>,
    )
    expect(screen.getByTestId("custom-child")).toBeInTheDocument()
  })

  it("renders both label and children if both are provided", () => {
    render(
      <IconWithText icon={<TestIcon />} label="Label">
        <span data-testid="child">Child</span>
      </IconWithText>,
    )
    expect(screen.getByText("Label")).toBeInTheDocument()
    expect(screen.getByTestId("child")).toBeInTheDocument()
  })

  it("renders nothing for label if label is undefined", () => {
    render(<IconWithText icon={<TestIcon />} />)
    expect(screen.queryByText("undefined")).not.toBeInTheDocument()
  })
})
