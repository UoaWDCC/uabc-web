import { render, screen } from "@repo/ui/test-utils"
import type { ReactNode } from "react"
import { vi } from "vitest"
import type { ColumnConfig } from "../types"
import { Filter } from "./Filter"
import { FilterActionsProvider } from "./FilterActionsContext"
import type { FilterBarConfig } from "./types"

export const createWrapper = ({ children }: { children: ReactNode }) => (
  <FilterActionsProvider>{children}</FilterActionsProvider>
)

const mockUseManagementTable = vi.fn()
vi.mock("../MemberManagementContext", () => ({
  useManagementTable: () => mockUseManagementTable(),
}))

describe("<Filter />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseManagementTable.mockReturnValue({
      fieldFilters: {},
      setFieldFilter: vi.fn(),
      clearFieldFilter: vi.fn(),
      filterValue: "",
      setFilterValue: vi.fn(),
      clearFilter: vi.fn(),
      visibleColumns: [],
      toggleColumn: vi.fn(),
      selectedRows: new Set(),
      filteredData: [],
    })
  })

  it("renders text, select, and multiselect filters", () => {
    const filterConfigs = [
      { type: "text", key: ["name"], label: "Name" },
      {
        type: "select",
        key: "status",
        label: "Status",
        items: [{ label: "Active", value: "active" as const }],
      },
      {
        type: "multiselect",
        key: "role",
        label: "Role",
        items: [{ label: "Admin", value: "admin" as const }],
      },
    ] as FilterBarConfig<{ name: string; status: string; role: string }>[]
    const columnsConfig = [
      { key: "name", label: "Name", required: true },
      { key: "status", label: "Status" },
    ] as ColumnConfig<{ name: string; status: string; role: string }>[]

    render(<Filter columnsConfig={columnsConfig} filterConfigs={filterConfigs} />, {
      wrapper: createWrapper,
    })

    // Test that text filter is rendered
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument()

    // Test that select filter is rendered
    expect(screen.getByRole("combobox", { name: /status/i })).toBeInTheDocument()

    // Test that multiselect filter is rendered
    expect(screen.getByRole("combobox", { name: /role/i })).toBeInTheDocument()

    // Test that actions are rendered (Add and Export buttons)
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument()

    // Test that column visibility toggle is rendered
    expect(screen.getByRole("button", { name: /toggle column visibility/i })).toBeInTheDocument()
  })

  it("renders with empty filterConfigs", () => {
    const columnsConfig = [{ key: "name", label: "Name", required: true }] as ColumnConfig<{
      name: string
    }>[]

    render(<Filter columnsConfig={columnsConfig} filterConfigs={[]} />, { wrapper: createWrapper })

    // Test that actions are still rendered even with no filters
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /toggle column visibility/i })).toBeInTheDocument()
  })
})
