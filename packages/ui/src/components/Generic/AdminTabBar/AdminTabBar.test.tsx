import "@testing-library/jest-dom"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { AdminTabBar } from "./AdminTabBar"
import * as AdminTabBarModule from "./index"

describe("<AdminTabBar />", () => {
  const defaultTabs = [
    { slug: "/admin/members", label: "View Members" },
    { slug: "/admin/sessions", label: "View Sessions" },
    { slug: "/admin/semesters", label: "View Semesters" },
  ]

  it("should re-export the AdminTabBar component and check if AdminTabBar exists", () => {
    expect(AdminTabBarModule.AdminTabBar).toBeDefined()
    expect(isValidElement(<AdminTabBarModule.AdminTabBar tabs={defaultTabs} />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(AdminTabBar.displayName).toBe("AdminTabBar")
  })

  it("should render tabs correctly", () => {
    render(<AdminTabBar tabs={defaultTabs} />)

    expect(screen.getByText("View Members")).toBeInTheDocument()
    expect(screen.getByText("View Sessions")).toBeInTheDocument()
    expect(screen.getByText("View Semesters")).toBeInTheDocument()
  })

  it("should render custom tabs correctly", () => {
    const customTabs = [
      { slug: "/admin/custom1", label: "Custom Tab 1" },
      { slug: "/admin/custom2", label: "Custom Tab 2" },
    ]

    render(<AdminTabBar tabs={customTabs} />)

    expect(screen.getByText("Custom Tab 1")).toBeInTheDocument()
    expect(screen.getByText("Custom Tab 2")).toBeInTheDocument()
  })

  it("should render different number of tabs correctly", () => {
    const twoTabs = [
      { slug: "/admin/dashboard", label: "Dashboard" },
      { slug: "/admin/settings", label: "Settings" },
    ]

    render(<AdminTabBar tabs={twoTabs} />)

    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()
  })
})
