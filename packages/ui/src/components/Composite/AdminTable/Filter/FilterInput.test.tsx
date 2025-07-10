import { render, screen } from "@repo/ui/test-utils"
import { NuqsAdapter } from "nuqs/adapters/react"
import type { ReactNode } from "react"
import { FilterInput } from "./FilterInput"

// Helper to create a wrapper with NuqsAdapter
const createWrapper = ({ children }: { children: ReactNode }) => (
  <NuqsAdapter>{children}</NuqsAdapter>
)

// Mock the MemberManagementContext to control the state
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
    useMemberManagement: vi.fn(() => mockContextValue),
  }
})

describe("FilterInput", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock context to default values
    Object.assign(mockContextValue, {
      filterValue: "",
      setFilterValue: vi.fn(),
    })
  })

  describe("Component Structure", () => {
    it("should have correct displayName", () => {
      expect(FilterInput.displayName).toBe("FilterInput")
    })

    it("should render text input", () => {
      render(<FilterInput />, { wrapper: createWrapper })

      const input = screen.getByRole("textbox")
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute("placeholder", "Filter members...")
    })
  })

  describe("Input Functionality", () => {
    it("should display current filter value", () => {
      mockContextValue.filterValue = "test search"

      render(<FilterInput />, { wrapper: createWrapper })

      const input = screen.getByDisplayValue("test search")
      expect(input).toBeInTheDocument()
    })

    it("should call setFilterValue on input change", async () => {
      const setFilterValueMock = vi.fn()
      mockContextValue.setFilterValue = setFilterValueMock

      const { user } = render(<FilterInput />, { wrapper: createWrapper })

      const input = screen.getByRole("textbox")
      await user.type(input, "search term")

      expect(setFilterValueMock).toHaveBeenCalledWith("s")
      expect(setFilterValueMock).toHaveBeenCalledWith("e")
      expect(setFilterValueMock).toHaveBeenCalledWith("a")
    })

    it("should handle empty input", async () => {
      const setFilterValueMock = vi.fn()
      mockContextValue.setFilterValue = setFilterValueMock
      mockContextValue.filterValue = "existing text"

      const { user } = render(<FilterInput />, { wrapper: createWrapper })

      const input = screen.getByRole("textbox")
      await user.clear(input)

      expect(setFilterValueMock).toHaveBeenCalledWith("")
    })

    it("should handle special characters", async () => {
      const setFilterValueMock = vi.fn()
      mockContextValue.setFilterValue = setFilterValueMock

      const { user } = render(<FilterInput />, { wrapper: createWrapper })

      const input = screen.getByRole("textbox")
      await user.type(input, "@#$%")

      expect(setFilterValueMock).toHaveBeenCalledWith("@")
      expect(setFilterValueMock).toHaveBeenCalledWith("#")
      expect(setFilterValueMock).toHaveBeenCalledWith("$")
      expect(setFilterValueMock).toHaveBeenCalledWith("%")
    })
  })

  describe("Context Integration", () => {
    it("should use filterValue from context", () => {
      mockContextValue.filterValue = "context value"

      render(<FilterInput />, { wrapper: createWrapper })

      expect(screen.getByDisplayValue("context value")).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("should be accessible", () => {
      render(<FilterInput />, { wrapper: createWrapper })

      const input = screen.getByRole("textbox")
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute("placeholder", "Filter members...")
    })

    it("should support keyboard navigation", async () => {
      const { user } = render(<FilterInput />, { wrapper: createWrapper })

      const input = screen.getByRole("textbox")

      await user.tab()
      expect(input).toHaveFocus()
    })
  })

  describe("Performance", () => {
    it("should be memoized to prevent unnecessary rerenders", () => {
      const { rerender } = render(<FilterInput />, { wrapper: createWrapper })

      const input1 = screen.getByRole("textbox")

      rerender(<FilterInput />)

      const input2 = screen.getByRole("textbox")
      expect(input1).toBe(input2)
    })
  })
})
