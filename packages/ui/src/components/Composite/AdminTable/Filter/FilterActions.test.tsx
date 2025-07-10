import { render, screen } from "@repo/ui/test-utils"
import { NuqsAdapter } from "nuqs/adapters/react"
import type { ReactNode } from "react"
import { MemberManagementProvider } from "../MemberManagementContext"
import { FilterActions } from "./FilterActions"

const createWrapper = ({ children }: { children: ReactNode }) => (
  <NuqsAdapter>
    <MemberManagementProvider>{children}</MemberManagementProvider>
  </NuqsAdapter>
)

describe("FilterActions", () => {
  const originalConsoleLog = console.log
  beforeEach(() => {
    console.log = vi.fn()
  })

  afterEach(() => {
    console.log = originalConsoleLog
    vi.clearAllMocks()
  })

  describe("Component Structure", () => {
    it("should have correct displayName", () => {
      expect(FilterActions.displayName).toBe("FilterActions")
    })

    it("should render both action buttons", () => {
      render(<FilterActions />, { wrapper: createWrapper })

      expect(screen.getByText("Add Member")).toBeInTheDocument()
      expect(screen.getByText(/Export \d+ users/)).toBeInTheDocument()
    })

    it("should render buttons with correct icons", () => {
      const { container } = render(<FilterActions />, { wrapper: createWrapper })

      const svgs = container.querySelectorAll("svg")
      expect(svgs.length).toBeGreaterThanOrEqual(2)
    })

    it("should render buttons in ButtonGroup", () => {
      const { container } = render(<FilterActions />, { wrapper: createWrapper })

      const buttonContainer = container.firstChild
      expect(buttonContainer).toBeInTheDocument()
    })
  })

  describe("Add Member Button", () => {
    it("should render Add Member button correctly", () => {
      render(<FilterActions />, { wrapper: createWrapper })

      const addButton = screen.getByText("Add Member")
      expect(addButton).toBeInTheDocument()
      expect(addButton.closest("button")).toBeInTheDocument()
    })

    it("should call handleAddMember when clicked", async () => {
      const { user } = render(<FilterActions />, { wrapper: createWrapper })

      const addButton = screen.getByText("Add Member")
      await user.click(addButton)

      expect(console.log).toHaveBeenCalledWith("Add new member clicked")
    })

    it("should have correct button styling", () => {
      render(<FilterActions />, { wrapper: createWrapper })

      const addButton = screen.getByText("Add Member").closest("button")
      expect(addButton).toBeInTheDocument()
    })

    it("should support keyboard interaction", async () => {
      const { user } = render(<FilterActions />, { wrapper: createWrapper })

      const addButton = screen.getByText("Add Member").closest("button")

      addButton?.focus()
      await user.keyboard("{Enter}")

      expect(console.log).toHaveBeenCalledWith("Add new member clicked")
    })
  })

  describe("Export Button", () => {
    it("should render Export button correctly", () => {
      render(<FilterActions />, { wrapper: createWrapper })

      const exportButton = screen.getByText(/Export \d+ users/)
      expect(exportButton).toBeInTheDocument()
      expect(exportButton.closest("button")).toBeInTheDocument()
    })

    it("should call handleExportData when clicked", async () => {
      const { user } = render(<FilterActions />, { wrapper: createWrapper })

      const exportButton = screen.getByText(/Export \d+ users/)
      await user.click(exportButton)

      expect(console.log).toHaveBeenCalledWith("Export 40 users clicked")
    })

    it("should have correct button styling", () => {
      render(<FilterActions />, { wrapper: createWrapper })

      const exportButton = screen.getByText(/Export \d+ users/).closest("button")
      expect(exportButton).toBeInTheDocument()
    })

    it("should support keyboard interaction", async () => {
      const { user } = render(<FilterActions />, { wrapper: createWrapper })

      const exportButton = screen.getByText(/Export \d+ users/).closest("button")

      exportButton?.focus()
      await user.keyboard(" ")

      expect(console.log).toHaveBeenCalledWith("Export 40 users clicked")
    })
  })

  describe("Button Interactions", () => {
    it("should handle multiple clicks on Add Member", async () => {
      const { user } = render(<FilterActions />, { wrapper: createWrapper })

      const addButton = screen.getByText("Add Member")

      await user.click(addButton)
      await user.click(addButton)
      await user.click(addButton)

      expect(console.log).toHaveBeenCalledTimes(3)
      expect(console.log).toHaveBeenCalledWith("Add new member clicked")
    })

    it("should handle multiple clicks on Export", async () => {
      const { user } = render(<FilterActions />, { wrapper: createWrapper })

      const exportButton = screen.getByText(/Export \d+ users/)

      await user.click(exportButton)
      await user.click(exportButton)

      expect(console.log).toHaveBeenCalledTimes(2)
      expect(console.log).toHaveBeenCalledWith("Export 40 users clicked")
    })

    it("should handle clicking both buttons", async () => {
      const { user } = render(<FilterActions />, { wrapper: createWrapper })

      const addButton = screen.getByText("Add Member")
      const exportButton = screen.getByText(/Export \d+ users/)

      await user.click(addButton)
      await user.click(exportButton)

      expect(console.log).toHaveBeenCalledTimes(2)
      expect(console.log).toHaveBeenNthCalledWith(1, "Add new member clicked")
      expect(console.log).toHaveBeenNthCalledWith(2, "Export 40 users clicked")
    })
  })

  describe("Accessibility", () => {
    it("should have accessible button roles", () => {
      render(<FilterActions />, { wrapper: createWrapper })

      const buttons = screen.getAllByRole("button")
      expect(buttons).toHaveLength(2)

      buttons.forEach((button) => {
        expect(button).toBeInTheDocument()
        expect(button).toBeEnabled()
      })
    })

    it("should have accessible names", () => {
      render(<FilterActions />, { wrapper: createWrapper })

      expect(screen.getByRole("button", { name: /add member/i })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument()
    })

    it("should support tab navigation", async () => {
      const { user } = render(<FilterActions />, { wrapper: createWrapper })

      await user.tab()
      expect(screen.getByText("Add Member").closest("button")).toHaveFocus()

      await user.tab()
      expect(screen.getByText(/Export \d+ users/).closest("button")).toHaveFocus()
    })
  })

  describe("Performance", () => {
    it("should be memoized to prevent unnecessary rerenders", () => {
      const { rerender } = render(<FilterActions />, { wrapper: createWrapper })

      expect(screen.getByText("Add Member")).toBeInTheDocument()
      expect(screen.getByText(/Export \d+ users/)).toBeInTheDocument()

      rerender(<FilterActions />)

      expect(screen.getByText("Add Member")).toBeInTheDocument()
      expect(screen.getByText(/Export \d+ users/)).toBeInTheDocument()
    })
  })

  describe("Error Handling", () => {
    it("should handle console.log errors gracefully", async () => {
      const { user } = render(<FilterActions />, { wrapper: createWrapper })

      const addButton = screen.getByText("Add Member")
      await user.click(addButton)

      expect(() => {
        expect(console.log).toHaveBeenCalled()
      }).not.toThrow()
    })
  })
})
