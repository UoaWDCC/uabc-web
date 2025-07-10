import { render, screen } from "@repo/ui/test-utils"
import { NuqsAdapter } from "nuqs/adapters/react"
import type { ReactNode } from "react"
import { FilterColumnVisibility } from "./FilterColumnVisibility"

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
  roleFilter: "all" as const,
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
    AVAILABLE_COLUMNS: [
      { key: "name", label: "Name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "role", label: "Role", required: false },
      { key: "remainingSessions", label: "Remaining Sessions", required: false },
      { key: "university", label: "University", required: false },
      { key: "actions", label: "Actions", required: true },
    ],
  }
})

describe("FilterColumnVisibility", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(mockContextValue, {
      visibleColumns: ["name", "email", "role", "remainingSessions", "university", "actions"],
      setVisibleColumns: vi.fn(),
      toggleColumn: vi.fn(),
    })
  })

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

  describe("Column Toggle Functionality", () => {
    it("should call toggleColumn when checkbox is clicked", async () => {
      const toggleColumnMock = vi.fn()
      mockContextValue.toggleColumn = toggleColumnMock

      const { user } = render(<FilterColumnVisibility />, { wrapper: createWrapper })

      const button = screen.getByRole("button", { name: /toggle column visibility/i })
      await user.click(button)

      const remainingSessionsCheckbox = screen.getByRole("checkbox", {
        name: /remaining sessions/i,
      })
      await user.click(remainingSessionsCheckbox)

      expect(toggleColumnMock).toHaveBeenCalledWith("remainingSessions")
    })

    it("should show checked state for visible columns", async () => {
      mockContextValue.visibleColumns = [
        "name",
        "email",
        "role",
        "remainingSessions",
        "university",
        "actions",
      ]

      const { user } = render(<FilterColumnVisibility />, { wrapper: createWrapper })

      const button = screen.getByRole("button", { name: /toggle column visibility/i })
      await user.click(button)

      const nameCheckbox = screen.getByRole("checkbox", { name: /name/i })
      const universityCheckbox = screen.getByRole("checkbox", { name: /university/i })

      expect(nameCheckbox).toBeChecked()
      expect(universityCheckbox).toBeChecked()
    })

    it("should disable required columns", async () => {
      const { user } = render(<FilterColumnVisibility />, { wrapper: createWrapper })

      const button = screen.getByRole("button", { name: /toggle column visibility/i })
      await user.click(button)

      const nameCheckbox = screen.getByRole("checkbox", { name: /name/i })
      const emailCheckbox = screen.getByRole("checkbox", { name: /email/i })
      const actionsCheckbox = screen.getByRole("checkbox", { name: /actions/i })
      const roleCheckbox = screen.getByRole("checkbox", { name: /role/i })

      expect(nameCheckbox).toBeDisabled()
      expect(emailCheckbox).toBeDisabled()
      expect(actionsCheckbox).toBeDisabled()
      expect(roleCheckbox).not.toBeDisabled()
    })
  })

  describe("Context Integration", () => {
    it("should use visibleColumns from context", async () => {
      mockContextValue.visibleColumns = [
        "name",
        "email",
        "role",
        "remainingSessions",
        "university",
        "actions",
      ]

      const { user } = render(<FilterColumnVisibility />, { wrapper: createWrapper })

      const button = screen.getByRole("button", { name: /toggle column visibility/i })
      await user.click(button)

      const nameCheckbox = screen.getByRole("checkbox", { name: /name/i })
      const roleCheckbox = screen.getByRole("checkbox", { name: /role/i })

      expect(nameCheckbox).toBeChecked()
      expect(roleCheckbox).toBeChecked()
    })

    it("should use toggleColumn from context", async () => {
      const mockToggleColumn = vi.fn()
      mockContextValue.toggleColumn = mockToggleColumn

      const { user } = render(<FilterColumnVisibility />, { wrapper: createWrapper })

      const button = screen.getByRole("button", { name: /toggle column visibility/i })
      await user.click(button)

      const roleCheckbox = screen.getByRole("checkbox", { name: /role/i })
      await user.click(roleCheckbox)

      expect(mockToggleColumn).toHaveBeenCalledWith("role")
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
