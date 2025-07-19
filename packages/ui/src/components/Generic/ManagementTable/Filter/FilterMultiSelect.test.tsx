import { render, screen } from "@repo/ui/test-utils"
import { vi } from "vitest"
import { FilterMultiSelect } from "./FilterMultiSelect"

const mockUseManagementTable = vi.fn()
vi.mock("../MemberManagementContext", () => ({
  useManagementTable: () => mockUseManagementTable(),
}))

describe("<FilterMultiSelect />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders and allows selecting multiple items and clearing", async () => {
    let value: string[] = []
    const setFieldFilter = vi.fn((_, v) => {
      value = v
      mockUseManagementTable.mockReturnValue({
        fieldFilters: { role: value },
        setFieldFilter,
      })
    })
    mockUseManagementTable.mockReturnValue({
      fieldFilters: { role: value },
      setFieldFilter,
    })
    const items = [
      { label: "Admin", value: "Admin" as const },
      { label: "User", value: "user" as const },
    ]
    const { user, rerender } = render(
      <FilterMultiSelect filterKey={"role" as never} items={items} />,
    )
    const select = screen.getByRole("combobox")
    await user.click(select)
    const adminOption = screen.getByText("Admin")
    await user.click(adminOption)
    expect(setFieldFilter).toHaveBeenCalledWith("role", ["Admin"])
    mockUseManagementTable.mockReturnValue({
      fieldFilters: { role: ["Admin"] },
      setFieldFilter,
    })
    rerender(<FilterMultiSelect filterKey={"role" as never} items={items} />)
    await user.click(select)
    const userOption = screen.getByText("User")
    await user.click(userOption)
    expect(setFieldFilter).toHaveBeenCalledWith("role", ["Admin", "user"])
    mockUseManagementTable.mockReturnValue({
      fieldFilters: { role: ["Admin", "user"] },
      setFieldFilter,
    })
    rerender(<FilterMultiSelect filterKey={"role" as never} items={items} />)
    const clearButton = screen.getByLabelText(/clear/i)
    await user.click(clearButton)
    expect(setFieldFilter).toHaveBeenCalledWith("role", [])
  })

  it("renders with empty value", () => {
    mockUseManagementTable.mockReturnValue({
      fieldFilters: { role: undefined },
      setFieldFilter: vi.fn(),
    })
    const items = [
      { label: "Admin", value: "Admin" as const },
      { label: "User", value: "user" as const },
    ]
    render(<FilterMultiSelect filterKey={"role" as never} items={items} />)
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })
})
