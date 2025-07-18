import { render, screen } from "@repo/ui/test-utils"
import { vi } from "vitest"
import { FilterSelect } from "./FilterSelect"

const mockUseManagementTable = vi.fn()
vi.mock("../MemberManagementContext", () => ({
  useManagementTable: () => mockUseManagementTable(),
}))

describe("<FilterSelect />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders and allows selecting an item and clearing", async () => {
    let value = "all"
    const setFieldFilter = vi.fn((_, v) => {
      value = v
      mockUseManagementTable.mockReturnValue({
        fieldFilters: { status: value },
        setFieldFilter,
        clearFieldFilter,
      })
    })
    const clearFieldFilter = vi.fn()
    mockUseManagementTable.mockReturnValue({
      fieldFilters: { status: value },
      setFieldFilter,
      clearFieldFilter,
    })
    const items = [
      { label: "Active", value: "active" as const },
      { label: "Inactive", value: "inactive" as const },
    ]
    const { user, rerender } = render(
      <FilterSelect filterKey={"status" as never} items={items} label="Status" />,
    )
    const select = screen.getByRole("combobox")
    await user.click(select)
    const activeOption = screen.getByText("Active")
    await user.click(activeOption)
    expect(setFieldFilter).toHaveBeenCalledWith("status", "active")
    mockUseManagementTable.mockReturnValue({
      fieldFilters: { status: "active" },
      setFieldFilter,
      clearFieldFilter,
    })
    rerender(<FilterSelect filterKey={"status" as never} items={items} label="Status" />)
    await user.click(select)
    const allOption = screen.getByText("All")
    await user.click(allOption)
    expect(clearFieldFilter).toHaveBeenCalledWith("status")
  })

  it("renders with value from fieldFilters", () => {
    mockUseManagementTable.mockReturnValue({
      fieldFilters: { status: "inactive" },
      setFieldFilter: vi.fn(),
      clearFieldFilter: vi.fn(),
    })
    const items = [
      { label: "Active", value: "active" as const },
      { label: "Inactive", value: "inactive" as const },
    ]
    render(<FilterSelect filterKey={"status" as never} items={items} label="Status" />)
    const combobox = screen.getByRole("combobox")
    expect(combobox).toHaveTextContent("Inactive")
  })

  it("renders with empty value", () => {
    mockUseManagementTable.mockReturnValue({
      fieldFilters: { status: undefined },
      setFieldFilter: vi.fn(),
      clearFieldFilter: vi.fn(),
    })
    const items = [
      { label: "Active", value: "active" as const },
      { label: "Inactive", value: "inactive" as const },
    ]
    render(<FilterSelect filterKey={"status" as never} items={items} label="Status" />)
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })
})
