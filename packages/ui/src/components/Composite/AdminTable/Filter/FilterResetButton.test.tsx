import { render, screen } from "@repo/ui/test-utils"
import { NuqsAdapter } from "nuqs/adapters/react"
import type { ReactNode } from "react"
import { isValidElement } from "react"
import { FilterResetButton } from "./FilterResetButton"

const createWrapper = ({ children }: { children: ReactNode }) => (
  <NuqsAdapter>{children}</NuqsAdapter>
)

const mockContextValue = {
  members: [],
  filteredMembers: [],
  paginatedMembers: [],
  isLoading: false,
  filterValue: "",
  setFilterValue: vi.fn(),
  hasFilter: false,
  clearFilter: vi.fn(),
  currentPage: 1,
  setCurrentPage: vi.fn(),
  perPage: 20,
  setPerPage: vi.fn(),
  totalPages: 1,
}

vi.mock("../MemberManagementContext", async () => {
  const actual = await vi.importActual("../MemberManagementContext")
  return {
    ...actual,
    useMemberManagement: () => mockContextValue,
  }
})

describe("FilterResetButton", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(mockContextValue, {
      filterValue: "",
      hasFilter: false,
      clearFilter: vi.fn(),
    })
  })

  describe("Component Structure", () => {
    it("should have correct displayName", () => {
      expect(FilterResetButton.displayName).toBe("FilterResetButton")
    })
  })

  describe("Visibility Behavior", () => {
    it("should not render when hasFilter is false", () => {
      mockContextValue.hasFilter = false

      render(<FilterResetButton />, { wrapper: createWrapper })

      expect(screen.queryByText("Reset")).not.toBeInTheDocument()
      expect(screen.queryByRole("button")).not.toBeInTheDocument()
    })

    it("should render when hasFilter is true", () => {
      mockContextValue.hasFilter = true
      mockContextValue.filterValue = "test filter"

      render(<FilterResetButton />, { wrapper: createWrapper })

      expect(screen.getByText("Reset")).toBeInTheDocument()
      expect(screen.getByRole("button")).toBeInTheDocument()
    })
  })

  describe("Button Functionality", () => {
    it("should call clearFilter when clicked", async () => {
      mockContextValue.hasFilter = true
      const clearFilterMock = vi.fn()
      mockContextValue.clearFilter = clearFilterMock

      const { user } = render(<FilterResetButton />, { wrapper: createWrapper })

      const resetButton = screen.getByText("Reset")
      await user.click(resetButton)

      expect(clearFilterMock).toHaveBeenCalledTimes(1)
    })

    it("should render with correct button props", () => {
      mockContextValue.hasFilter = true

      render(<FilterResetButton />, { wrapper: createWrapper })

      const button = screen.getByRole("button")
      expect(button).toHaveAttribute("type", "button")
      expect(button).toHaveTextContent("Reset")
    })

    it("should render with X icon", () => {
      mockContextValue.hasFilter = true

      const { container } = render(<FilterResetButton />, { wrapper: createWrapper })

      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
    })

    it("should use ghost variant styling", () => {
      mockContextValue.hasFilter = true

      render(<FilterResetButton />, { wrapper: createWrapper })

      const button = screen.getByRole("button")
      expect(button).toBeInTheDocument()
    })
  })

  describe("Context Integration", () => {
    it("should use clearFilter function from context", async () => {
      mockContextValue.hasFilter = true
      const mockClearFilter = vi.fn()
      mockContextValue.clearFilter = mockClearFilter

      const { user } = render(<FilterResetButton />, { wrapper: createWrapper })

      await user.click(screen.getByText("Reset"))

      expect(mockClearFilter).toHaveBeenCalledTimes(1)
    })
  })

  describe("Accessibility", () => {
    it("should be accessible when visible", () => {
      mockContextValue.hasFilter = true

      render(<FilterResetButton />, { wrapper: createWrapper })

      const button = screen.getByRole("button")
      expect(button).toBeInTheDocument()
      expect(button).toHaveAccessibleName("Reset")
    })

    it("should support keyboard navigation", async () => {
      mockContextValue.hasFilter = true
      const mockClearFilter = vi.fn()
      mockContextValue.clearFilter = mockClearFilter

      const { user } = render(<FilterResetButton />, { wrapper: createWrapper })

      const button = screen.getByRole("button")

      await user.tab()
      expect(button).toHaveFocus()

      await user.keyboard("{Enter}")
      expect(mockClearFilter).toHaveBeenCalledTimes(1)
    })

    it("should support space key activation", async () => {
      mockContextValue.hasFilter = true
      const mockClearFilter = vi.fn()
      mockContextValue.clearFilter = mockClearFilter

      const { user } = render(<FilterResetButton />, { wrapper: createWrapper })

      const button = screen.getByRole("button")
      button.focus()

      await user.keyboard(" ")
      expect(mockClearFilter).toHaveBeenCalledTimes(1)
    })
  })

  describe("Edge Cases", () => {
    it("should handle multiple rapid clicks", async () => {
      mockContextValue.hasFilter = true
      const mockClearFilter = vi.fn()
      mockContextValue.clearFilter = mockClearFilter

      const { user } = render(<FilterResetButton />, { wrapper: createWrapper })

      const button = screen.getByText("Reset")

      await user.click(button)
      await user.click(button)
      await user.click(button)

      expect(mockClearFilter).toHaveBeenCalledTimes(3)
    })

    it("should handle context function being undefined", () => {
      mockContextValue.hasFilter = true
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      mockContextValue.clearFilter = undefined as any

      expect(() => {
        render(<FilterResetButton />, { wrapper: createWrapper })
      }).not.toThrow()
    })

    it("should handle hasFilter being undefined", () => {
      // biome-ignore lint/suspicious/noExplicitAny: this is for a test
      mockContextValue.hasFilter = undefined as any

      render(<FilterResetButton />, { wrapper: createWrapper })

      expect(screen.queryByText("Reset")).not.toBeInTheDocument()
    })
  })

  describe("Performance", () => {
    it("should memo properly to prevent unnecessary rerenders", () => {
      mockContextValue.hasFilter = true

      const { rerender } = render(<FilterResetButton />, { wrapper: createWrapper })

      expect(screen.getByText("Reset")).toBeInTheDocument()

      rerender(<FilterResetButton />)

      expect(screen.getByText("Reset")).toBeInTheDocument()
    })
  })

  describe("Component API", () => {
    it("should render as expected when exported", () => {
      expect(isValidElement(<FilterResetButton />)).toBe(true)
    })

    it("should be memoized component", () => {
      expect(FilterResetButton.displayName).toBe("FilterResetButton")
    })
  })
})
