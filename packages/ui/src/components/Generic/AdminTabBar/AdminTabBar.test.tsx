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

  it("should render custom tab labels correctly", () => {
    const customLabels = ["Custom Tab 1", "Custom Tab 2", "Custom Tab 3"]

    render(<AdminTabBar tabLabels={customLabels} />)

    expect(screen.getByText("Custom Tab 1")).toBeInTheDocument()
    expect(screen.getByText("Custom Tab 2")).toBeInTheDocument()
    expect(screen.getByText("Custom Tab 3")).toBeInTheDocument()
  })
})
