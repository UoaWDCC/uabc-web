import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as StatusIconModule from "./index"
import { StatusIcon } from "./StatusIcon"

describe("<StatusIcon />", () => {
  it("should re-export the StatusIcon component and check if StatusIcon exists", () => {
    expect(StatusIconModule.StatusIcon).toBeDefined()
    expect(isValidElement(<StatusIconModule.StatusIcon status="Member" />)).toBeTruthy()
  })

  it("should handle both status values correctly", () => {
    const { rerender } = render(<StatusIcon data-testid="status-icon" status="Member" />)
    let icon = screen.getByTestId("status-icon")
    expect(icon).toBeInTheDocument()

    rerender(<StatusIcon data-testid="status-icon" status="Casual" />)
    icon = screen.getByTestId("status-icon")
    expect(icon).toBeInTheDocument()
  })

  it("should have correct displayName", () => {
    expect(StatusIcon.displayName).toBe("StatusIcon")
  })
})
