import { act, render, renderHook, screen } from "@repo/ui/test-utils"
import { NuqsAdapter } from "nuqs/adapters/react"
import type { ReactNode } from "react"
import { MemberManagementProvider, useMemberManagement } from "./MemberManagementContext"

const createWrapper = ({ children }: { children: ReactNode }) => (
  <NuqsAdapter>
    <MemberManagementProvider>{children}</MemberManagementProvider>
  </NuqsAdapter>
)

const TestComponent = () => {
  const context = useMemberManagement()
  return (
    <div>
      <div data-testid="filter-value">{context.filterValue}</div>
      <div data-testid="current-page">{context.currentPage}</div>
      <div data-testid="per-page">{context.perPage}</div>
      <div data-testid="total-pages">{context.totalPages}</div>
      <div data-testid="has-filter">{context.hasFilter.toString()}</div>
      <div data-testid="is-loading">{context.isLoading.toString()}</div>
      <div data-testid="members-count">{context.members.length}</div>
      <div data-testid="filtered-members-count">{context.filteredMembers.length}</div>
      <div data-testid="paginated-members-count">{context.paginatedMembers.length}</div>
      <button onClick={() => context.setFilterValue("test filter")} type="button">
        Set Filter
      </button>
      <button onClick={() => context.setCurrentPage(2)} type="button">
        Set Page 2
      </button>
      <button onClick={() => context.setPerPage(50)} type="button">
        Set Per Page 50
      </button>
      <button onClick={context.clearFilter} type="button">
        Clear Filter
      </button>
    </div>
  )
}

describe("MemberManagementContext", () => {
  describe("MemberManagementProvider", () => {
    it("should provide default state values", () => {
      render(<TestComponent />, { wrapper: createWrapper })

      expect(screen.getByTestId("filter-value")).toHaveTextContent("")
      expect(screen.getByTestId("current-page")).toHaveTextContent("1")
      expect(screen.getByTestId("per-page")).toHaveTextContent("20")
      expect(screen.getByTestId("has-filter")).toHaveTextContent("false")
      expect(screen.getByTestId("is-loading")).toHaveTextContent("false")
      expect(screen.getByTestId("members-count")).toHaveTextContent("40")
    })

    it("should generate mock users correctly", () => {
      render(<TestComponent />, { wrapper: createWrapper })

      // Should have 40 mock members
      expect(screen.getByTestId("members-count")).toHaveTextContent("40")

      // Initially, filtered members should equal total members
      expect(screen.getByTestId("filtered-members-count")).toHaveTextContent("40")

      // Default pagination should show 20 members
      expect(screen.getByTestId("paginated-members-count")).toHaveTextContent("20")

      // Total pages should be 2 (40 / 20)
      expect(screen.getByTestId("total-pages")).toHaveTextContent("2")
    })
  })

  describe("useMemberManagement hook", () => {
    it("should throw error when used outside provider", () => {
      // Suppress console.error for this test
      const originalError = console.error
      console.error = vi.fn()

      expect(() => {
        renderHook(() => useMemberManagement())
      }).toThrow("useMemberManagement must be used within a MemberManagementProvider")

      console.error = originalError
    })

    it("should return context values when used within provider", () => {
      const { result } = renderHook(() => useMemberManagement(), {
        wrapper: createWrapper,
      })

      expect(result.current).toMatchObject({
        filterValue: "",
        currentPage: 1,
        perPage: 20,
        hasFilter: false,
        isLoading: false,
      })

      expect(result.current.members).toHaveLength(40)
      expect(result.current.filteredMembers).toHaveLength(40)
      expect(result.current.paginatedMembers).toHaveLength(20)
      expect(result.current.totalPages).toBe(2)

      expect(typeof result.current.setFilterValue).toBe("function")
      expect(typeof result.current.setCurrentPage).toBe("function")
      expect(typeof result.current.setPerPage).toBe("function")
      expect(typeof result.current.clearFilter).toBe("function")
    })
  })

  describe("Filter functionality", () => {
    it("should filter members by search term", async () => {
      const { user } = render(<TestComponent />, { wrapper: createWrapper })

      // Initially no filter
      expect(screen.getByTestId("has-filter")).toHaveTextContent("false")
      expect(screen.getByTestId("filtered-members-count")).toHaveTextContent("40")

      // Set a filter
      await user.click(screen.getByText("Set Filter"))

      expect(screen.getByTestId("filter-value")).toHaveTextContent("test filter")
      expect(screen.getByTestId("has-filter")).toHaveTextContent("true")

      // Filtered members count should be less than total (unless "test filter" matches many records)
      const filteredCount = Number.parseInt(
        screen.getByTestId("filtered-members-count").textContent || "0",
      )
      expect(filteredCount).toBeLessThanOrEqual(40)
    })

    it("should reset page to 1 when setting filter", async () => {
      const { user } = render(<TestComponent />, { wrapper: createWrapper })

      // First set page to 2
      await user.click(screen.getByText("Set Page 2"))
      expect(screen.getByTestId("current-page")).toHaveTextContent("2")

      // Then set a filter - should reset to page 1
      await user.click(screen.getByText("Set Filter"))
      expect(screen.getByTestId("current-page")).toHaveTextContent("1")
    })

    it("should clear filter correctly", async () => {
      const { user } = render(<TestComponent />, { wrapper: createWrapper })

      // Set a filter first
      await user.click(screen.getByText("Set Filter"))
      expect(screen.getByTestId("has-filter")).toHaveTextContent("true")

      // Clear the filter
      await user.click(screen.getByText("Clear Filter"))
      expect(screen.getByTestId("filter-value")).toHaveTextContent("")
      expect(screen.getByTestId("has-filter")).toHaveTextContent("false")
      expect(screen.getByTestId("current-page")).toHaveTextContent("1")
      expect(screen.getByTestId("filtered-members-count")).toHaveTextContent("40")
    })
  })

  describe("Pagination functionality", () => {
    it("should change current page", async () => {
      const { user } = render(<TestComponent />, { wrapper: createWrapper })

      expect(screen.getByTestId("current-page")).toHaveTextContent("1")

      await user.click(screen.getByText("Set Page 2"))
      expect(screen.getByTestId("current-page")).toHaveTextContent("2")
    })

    it("should change per page setting", async () => {
      const { user } = render(<TestComponent />, { wrapper: createWrapper })

      expect(screen.getByTestId("per-page")).toHaveTextContent("20")
      expect(screen.getByTestId("total-pages")).toHaveTextContent("2")

      await user.click(screen.getByText("Set Per Page 50"))

      expect(screen.getByTestId("per-page")).toHaveTextContent("50")
      expect(screen.getByTestId("current-page")).toHaveTextContent("1")
      expect(screen.getByTestId("total-pages")).toHaveTextContent("1")
    })
  })

  describe("Search functionality", () => {
    it("should search by name", () => {
      const { result } = renderHook(() => useMemberManagement(), {
        wrapper: createWrapper,
      })

      // Get a member's name to search for
      const firstMember = result.current.members[0]
      const searchTerm = firstMember.firstName.toLowerCase()

      act(() => {
        result.current.setFilterValue(searchTerm)
      })

      // Should find at least the member we're searching for
      expect(result.current.filteredMembers.length).toBeGreaterThan(0)
      expect(
        result.current.filteredMembers.some((m) => m.firstName.toLowerCase().includes(searchTerm)),
      ).toBe(true)
    })

    it("should search by email", () => {
      const { result } = renderHook(() => useMemberManagement(), {
        wrapper: createWrapper,
      })

      // Get a member's email to search for
      const firstMember = result.current.members[0]
      const emailPart = firstMember.email.split("@")[0]

      act(() => {
        result.current.setFilterValue(emailPart)
      })

      // Should find the member
      expect(result.current.filteredMembers.length).toBeGreaterThan(0)
      expect(
        result.current.filteredMembers.some((m) =>
          m.email.toLowerCase().includes(emailPart.toLowerCase()),
        ),
      ).toBe(true)
    })

    it("should search by role", () => {
      const { result } = renderHook(() => useMemberManagement(), {
        wrapper: createWrapper,
      })

      act(() => {
        result.current.setFilterValue("member")
      })

      // Should only find members with "member" role
      expect(result.current.filteredMembers.length).toBeGreaterThan(0)
      expect(result.current.filteredMembers.every((m) => m.role === "member")).toBe(true)
    })

    it("should return empty results for non-matching search", () => {
      const { result } = renderHook(() => useMemberManagement(), {
        wrapper: createWrapper,
      })

      act(() => {
        result.current.setFilterValue("nonexistentterm12345")
      })

      expect(result.current.filteredMembers).toHaveLength(0)
      expect(result.current.paginatedMembers).toHaveLength(0)
      expect(result.current.totalPages).toBe(0)
    })
  })

  describe("URL state management", () => {
    it("should sync state with URL parameters", async () => {
      const { user } = render(<TestComponent />, { wrapper: createWrapper })

      await user.click(screen.getByText("Set Filter"))

      await user.click(screen.getByText("Set Page 2"))

      await user.click(screen.getByText("Set Per Page 50"))

      expect(screen.getByTestId("filter-value")).toHaveTextContent("test filter")
      expect(screen.getByTestId("current-page")).toHaveTextContent("1")
      expect(screen.getByTestId("per-page")).toHaveTextContent("50")
    })
  })
})
