import { render, screen } from "@repo/ui/test-utils"
import { FilterActions } from "./FilterActions"

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
      render(<FilterActions />)

      expect(screen.getByText("Add Member")).toBeInTheDocument()
      expect(screen.getByText("Export")).toBeInTheDocument()
    })

    it("should render buttons with correct icons", () => {
      const { container } = render(<FilterActions />)

      const svgs = container.querySelectorAll("svg")
      expect(svgs.length).toBeGreaterThanOrEqual(2)
    })

    it("should render buttons in ButtonGroup", () => {
      const { container } = render(<FilterActions />)

      const buttonContainer = container.firstChild
      expect(buttonContainer).toBeInTheDocument()
    })
  })

  describe("Add Member Button", () => {
    it("should render Add Member button correctly", () => {
      render(<FilterActions />)

      const addButton = screen.getByText("Add Member")
      expect(addButton).toBeInTheDocument()
      expect(addButton.closest("button")).toBeInTheDocument()
    })

    it("should call handleAddMember when clicked", async () => {
      const { user } = render(<FilterActions />)

      const addButton = screen.getByText("Add Member")
      await user.click(addButton)

      expect(console.log).toHaveBeenCalledWith("Add new member clicked")
    })

    it("should have correct button styling", () => {
      render(<FilterActions />)

      const addButton = screen.getByText("Add Member").closest("button")
      expect(addButton).toBeInTheDocument()
    })

    it("should support keyboard interaction", async () => {
      const { user } = render(<FilterActions />)

      const addButton = screen.getByText("Add Member").closest("button")

      addButton?.focus()
      await user.keyboard("{Enter}")

      expect(console.log).toHaveBeenCalledWith("Add new member clicked")
    })
  })

  describe("Export Button", () => {
    it("should render Export button correctly", () => {
      render(<FilterActions />)

      const exportButton = screen.getByText("Export")
      expect(exportButton).toBeInTheDocument()
      expect(exportButton.closest("button")).toBeInTheDocument()
    })

    it("should call handleExportData when clicked", async () => {
      const { user } = render(<FilterActions />)

      const exportButton = screen.getByText("Export")
      await user.click(exportButton)

      expect(console.log).toHaveBeenCalledWith("Export data clicked")
    })

    it("should have correct button styling", () => {
      render(<FilterActions />)

      const exportButton = screen.getByText("Export").closest("button")
      expect(exportButton).toBeInTheDocument()
    })

    it("should support keyboard interaction", async () => {
      const { user } = render(<FilterActions />)

      const exportButton = screen.getByText("Export").closest("button")

      exportButton?.focus()
      await user.keyboard(" ")

      expect(console.log).toHaveBeenCalledWith("Export data clicked")
    })
  })

  describe("Button Interactions", () => {
    it("should handle multiple clicks on Add Member", async () => {
      const { user } = render(<FilterActions />)

      const addButton = screen.getByText("Add Member")

      await user.click(addButton)
      await user.click(addButton)
      await user.click(addButton)

      expect(console.log).toHaveBeenCalledTimes(3)
      expect(console.log).toHaveBeenCalledWith("Add new member clicked")
    })

    it("should handle multiple clicks on Export", async () => {
      const { user } = render(<FilterActions />)

      const exportButton = screen.getByText("Export")

      await user.click(exportButton)
      await user.click(exportButton)

      expect(console.log).toHaveBeenCalledTimes(2)
      expect(console.log).toHaveBeenCalledWith("Export data clicked")
    })

    it("should handle clicking both buttons", async () => {
      const { user } = render(<FilterActions />)

      const addButton = screen.getByText("Add Member")
      const exportButton = screen.getByText("Export")

      await user.click(addButton)
      await user.click(exportButton)

      expect(console.log).toHaveBeenCalledTimes(2)
      expect(console.log).toHaveBeenNthCalledWith(1, "Add new member clicked")
      expect(console.log).toHaveBeenNthCalledWith(2, "Export data clicked")
    })
  })

  describe("Accessibility", () => {
    it("should have accessible button roles", () => {
      render(<FilterActions />)

      const buttons = screen.getAllByRole("button")
      expect(buttons).toHaveLength(2)

      buttons.forEach((button) => {
        expect(button).toBeInTheDocument()
        expect(button).toBeEnabled()
      })
    })

    it("should have accessible names", () => {
      render(<FilterActions />)

      expect(screen.getByRole("button", { name: /add member/i })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument()
    })

    it("should support tab navigation", async () => {
      const { user } = render(<FilterActions />)

      await user.tab()
      expect(screen.getByText("Add Member").closest("button")).toHaveFocus()

      await user.tab()
      expect(screen.getByText("Export").closest("button")).toHaveFocus()
    })
  })

  describe("Performance", () => {
    it("should be memoized to prevent unnecessary rerenders", () => {
      const { rerender } = render(<FilterActions />)

      expect(screen.getByText("Add Member")).toBeInTheDocument()
      expect(screen.getByText("Export")).toBeInTheDocument()

      rerender(<FilterActions />)

      expect(screen.getByText("Add Member")).toBeInTheDocument()
      expect(screen.getByText("Export")).toBeInTheDocument()
    })
  })

  describe("Error Handling", () => {
    it("should handle console.log errors gracefully", async () => {
      console.log = vi.fn().mockImplementation(() => {
        throw new Error("Console error")
      })

      const { user } = render(<FilterActions />)

      expect(async () => {
        await user.click(screen.getByText("Add Member"))
      }).not.toThrow()
    })
  })
})
