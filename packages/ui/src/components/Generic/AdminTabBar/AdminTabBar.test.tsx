import "@testing-library/jest-dom"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { AdminTabBar } from "./AdminTabBar"
import * as AdminTabBarModule from "./index"

describe("<AdminTabBar />", () => {
  it("should re-export the AdminTabBar component and check if AdminTabBar exists", () => {
    expect(AdminTabBarModule.AdminTabBar).toBeDefined()
    expect(isValidElement(<AdminTabBarModule.AdminTabBar />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(AdminTabBar.displayName).toBe("AdminTabBar")
  })

  it("should render default tab labels correctly", () => {
    render(<AdminTabBar />)

    expect(screen.getByText("View Members")).toBeInTheDocument()
    expect(screen.getByText("View Sessions")).toBeInTheDocument()
    expect(screen.getByText("View Semesters")).toBeInTheDocument()
  })

  it("should call onChange when a user clicks on a tab", async () => {
    const onChange = vi.fn()

    const { user } = render(<AdminTabBar onChange={onChange} tabLabel2="tab-to-select" />)

    const tabToSelect = screen.getByText("tab-to-select")
    await user.click(tabToSelect)

    expect(onChange).toBeCalledWith(2)
  })
})
