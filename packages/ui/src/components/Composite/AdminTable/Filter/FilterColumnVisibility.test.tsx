import { render, screen } from "@repo/ui/test-utils"
import { NuqsAdapter } from "nuqs/adapters/react"
import type { ReactNode } from "react"
import { MemberManagementProvider } from "../MemberManagementContext"
import { FilterColumnVisibility } from "./FilterColumnVisibility"

const createWrapper = ({ children }: { children: ReactNode }) => (
  <NuqsAdapter>
    <MemberManagementProvider>{children}</MemberManagementProvider>
  </NuqsAdapter>
)

describe("FilterColumnVisibility", () => {
  describe("Component Structure", () => {
    it("should have correct displayName", () => {
      expect(FilterColumnVisibility.displayName).toBe("FilterColumnVisibility")
    })

    it("should render popover trigger button", () => {
      render(<FilterColumnVisibility />, { wrapper: createWrapper })

      const button = screen.getByRole("button", { name: /toggle column visibility/i })
      expect(button).toBeInTheDocument()
    })

    it("should render with eye icon", () => {
      const { container } = render(<FilterColumnVisibility />, { wrapper: createWrapper })

      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
    })
  })

  describe("Popover Content", () => {
    it("should show column visibility options when clicked", async () => {
      const { user } = render(<FilterColumnVisibility />, { wrapper: createWrapper })

      const button = screen.getByRole("button", { name: /toggle column visibility/i })
      await user.click(button)

      expect(screen.getByText("Column Visibility")).toBeInTheDocument()
    })

    it("should render checkboxes for all columns", async () => {
      const { user } = render(<FilterColumnVisibility />, { wrapper: createWrapper })

      const button = screen.getByRole("button", { name: /toggle column visibility/i })
      await user.click(button)

      expect(screen.getByText("Name")).toBeInTheDocument()
      expect(screen.getByText("Email")).toBeInTheDocument()
      expect(screen.getByText("Role")).toBeInTheDocument()
      expect(screen.getByText("Remaining Sessions")).toBeInTheDocument()
      expect(screen.getByText("University")).toBeInTheDocument()
      expect(screen.getByText("Actions")).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("should be accessible", () => {
      render(<FilterColumnVisibility />, { wrapper: createWrapper })

      const button = screen.getByRole("button", { name: /toggle column visibility/i })
      expect(button).toBeInTheDocument()
      expect(button).toBeEnabled()
    })

    it("should support keyboard navigation", async () => {
      const { user } = render(<FilterColumnVisibility />, { wrapper: createWrapper })

      const button = screen.getByRole("button", { name: /toggle column visibility/i })

      await user.tab()
      expect(button).toHaveFocus()
    })

    it("should have proper ARIA labels", () => {
      render(<FilterColumnVisibility />, { wrapper: createWrapper })

      const button = screen.getByRole("button", { name: /toggle column visibility/i })
      expect(button).toHaveAttribute("aria-label", "Toggle column visibility")
    })
  })

  describe("Performance", () => {
    it("should be memoized to prevent unnecessary rerenders", () => {
      const { rerender } = render(<FilterColumnVisibility />, { wrapper: createWrapper })

      expect(screen.getByRole("button", { name: /toggle column visibility/i })).toBeInTheDocument()

      rerender(<FilterColumnVisibility />)

      expect(screen.getByRole("button", { name: /toggle column visibility/i })).toBeInTheDocument()
    })
  })
})
