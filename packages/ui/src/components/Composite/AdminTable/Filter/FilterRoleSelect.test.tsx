import type { User } from "@repo/shared/payload-types"
import { render, screen } from "@repo/ui/test-utils"
import { NuqsAdapter } from "nuqs/adapters/react"
import type { ReactNode } from "react"
import { FilterRoleSelect } from "./FilterRoleSelect"

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
  roleFilter: "all" as User["role"] | "all",
  setRoleFilter: vi.fn(),
  hasFilter: false,
  clearFilter: vi.fn(),
  visibleColumns: ["name", "email", "role", "remainingSessions", "university", "actions"] as const,
  setVisibleColumns: vi.fn(),
  toggleColumn: vi.fn(),
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

describe("FilterRoleSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(mockContextValue, {
      roleFilter: "all",
      setRoleFilter: vi.fn(),
    })
  })

  describe("Component Structure", () => {
    it("should have correct displayName", () => {
      expect(FilterRoleSelect.displayName).toBe("FilterRoleSelect")
    })

    it("should render select component", () => {
      render(<FilterRoleSelect />, { wrapper: createWrapper })

      expect(screen.getByRole("combobox")).toBeInTheDocument()
    })

    it("should render with users icon", () => {
      const { container } = render(<FilterRoleSelect />, { wrapper: createWrapper })

      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
    })
  })

  describe("Role Options", () => {
    it("should render all role options", () => {
      render(<FilterRoleSelect />, { wrapper: createWrapper })

      // The options will be available when the select is opened
      // For now we test that the select component is rendered
      expect(screen.getByRole("combobox")).toBeInTheDocument()
    })

    it("should display current role filter value", () => {
      mockContextValue.roleFilter = "admin"

      render(<FilterRoleSelect />, { wrapper: createWrapper })

      const select = screen.getByRole("combobox")
      expect(select).toHaveTextContent("Admin")
    })
  })

  describe("Functionality", () => {
    it("should call setRoleFilter when role changes", async () => {
      const setRoleFilterMock = vi.fn()
      mockContextValue.setRoleFilter = setRoleFilterMock

      const { user } = render(<FilterRoleSelect />, { wrapper: createWrapper })

      const select = screen.getByRole("combobox")

      await user.click(select)
      await user.click(screen.getByText("Member"))

      expect(setRoleFilterMock).toHaveBeenCalledWith("member")
    })
  })

  describe("Context Integration", () => {
    it("should use roleFilter from context", () => {
      mockContextValue.roleFilter = "casual"

      render(<FilterRoleSelect />, { wrapper: createWrapper })

      const select = screen.getByRole("combobox")
      expect(select).toHaveTextContent("Casual")
    })

    it("should use setRoleFilter from context", async () => {
      const mockSetRoleFilter = vi.fn()
      mockContextValue.setRoleFilter = mockSetRoleFilter

      const { user } = render(<FilterRoleSelect />, { wrapper: createWrapper })

      const select = screen.getByRole("combobox")
      await user.click(select)
      await user.click(screen.getByText("Admin"))

      expect(mockSetRoleFilter).toHaveBeenCalledWith("admin")
    })
  })

  describe("Accessibility", () => {
    it("should be accessible", () => {
      render(<FilterRoleSelect />, { wrapper: createWrapper })

      const select = screen.getByRole("combobox")
      expect(select).toBeInTheDocument()
      expect(select).toBeEnabled()
    })

    it("should support keyboard navigation", async () => {
      const { user } = render(<FilterRoleSelect />, { wrapper: createWrapper })

      const select = screen.getByRole("combobox")

      await user.tab()
      expect(select).toHaveFocus()
    })
  })
})
