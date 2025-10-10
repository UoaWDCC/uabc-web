import { render, screen } from "@repo/ui/test-utils"
import { isValidElement, type ReactNode } from "react"
import { FilterActions } from "./FilterActions"
import { FilterActionsProvider } from "./FilterActionsContext"

export const createWrapper = ({ children }: { children: ReactNode }) => (
  <FilterActionsProvider>{children}</FilterActionsProvider>
)

const mockUseManagementTable = vi.fn()
vi.mock("../MemberManagementContext", () => ({
  useManagementTable: () => mockUseManagementTable(),
}))

vi.mock("./FilterActionsContext", async () => {
  const actual = await vi.importActual("./FilterActionsContext")
  return {
    ...actual,
    useFilterActions: vi.fn(() => ({
      addMember: vi.fn(),
      setAddMember: vi.fn(),
    })),
  }
})

describe("<FilterActions />", () => {
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

  it("should have correct displayName", () => {
    expect(FilterActions.displayName).toBe("FilterActions")
  })

  it("should be a valid React element", () => {
    expect(isValidElement(<FilterActions columns={[]} />)).toBeTruthy()
  })

  it("should handle adding a member", async () => {
    const { user } = render(<FilterActions columns={[]} />, {
      wrapper: createWrapper,
    })

    await user.click(screen.getByText("Add"))

    await user.type(screen.getByTestId("first-name"), "First-name")
    await user.type(screen.getByTestId("email"), "test@example.com")
    await user.click(screen.getByTestId("role"))
    await user.click(screen.getByText("casual"))

    await user.click(screen.getByTestId("submit"))
  })
})
