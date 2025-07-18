import { render, screen } from "@repo/ui/test-utils"
import { vi } from "vitest"
import { FilterInput } from "./FilterInput"

const mockUseManagementTable = vi.fn()
vi.mock("../MemberManagementContext", () => ({
  useManagementTable: () => mockUseManagementTable(),
}))

describe("<FilterInput />", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders with filterKey and handles input change and clear", async () => {
    let value = ""
    const setFieldFilter = vi.fn((_, v) => {
      value = v
      // update the mock to return the new value on next render
      mockUseManagementTable.mockReturnValue({
        fieldFilters: { name: value },
        setFieldFilter,
        clearFieldFilter,
        filterValue: "",
        setFilterValue: vi.fn(),
        clearFilter: vi.fn(),
      })
    })
    const clearFieldFilter = vi.fn()
    mockUseManagementTable.mockReturnValue({
      fieldFilters: { name: value },
      setFieldFilter,
      clearFieldFilter,
      filterValue: "",
      setFilterValue: vi.fn(),
      clearFilter: vi.fn(),
    })
    const { user, rerender } = render(<FilterInput filterKey={"name" as never} label="Name" />)
    const input = screen.getByPlaceholderText(/name/i)
    await user.type(input, "abc")
    expect(setFieldFilter.mock.calls).toEqual([
      ["name", "a"],
      ["name", "b"],
      ["name", "c"],
    ])
    // force re-render with updated value
    mockUseManagementTable.mockReturnValue({
      fieldFilters: { name: "abc" },
      setFieldFilter,
      clearFieldFilter,
      filterValue: "",
      setFilterValue: vi.fn(),
      clearFilter: vi.fn(),
    })
    // re-render to reflect the new value
    rerender(<FilterInput filterKey={"name" as never} label="Name" />)
    const reset = screen.getByLabelText(/reset filter/i)
    await user.click(reset)
    expect(clearFieldFilter).toHaveBeenCalledWith("name")
  })

  it("renders with searchKeys and handles input change and clear", async () => {
    let value = ""
    const setFilterValue = vi.fn((v, _) => {
      value = v
      mockUseManagementTable.mockReturnValue({
        fieldFilters: {},
        setFieldFilter: vi.fn(),
        clearFieldFilter: vi.fn(),
        filterValue: value,
        setFilterValue,
        clearFilter,
      })
    })
    const clearFilter = vi.fn()
    mockUseManagementTable.mockReturnValue({
      fieldFilters: {},
      setFieldFilter: vi.fn(),
      clearFieldFilter: vi.fn(),
      filterValue: value,
      setFilterValue,
      clearFilter,
    })
    const { user, rerender } = render(<FilterInput label="Name" searchKeys={["name"]} />)
    const input = screen.getByPlaceholderText(/name/i)
    await user.type(input, "xyz")
    expect(setFilterValue.mock.calls).toEqual([
      ["x", ["name"]],
      ["y", ["name"]],
      ["z", ["name"]],
    ])
    mockUseManagementTable.mockReturnValue({
      fieldFilters: {},
      setFieldFilter: vi.fn(),
      clearFieldFilter: vi.fn(),
      filterValue: "xyz",
      setFilterValue,
      clearFilter,
    })
    rerender(<FilterInput label="Name" searchKeys={["name"]} />)
    const reset = screen.getByLabelText(/reset filter/i)
    await user.click(reset)
    expect(clearFilter).toHaveBeenCalled()
  })

  it("renders with no filterKey or searchKeys", () => {
    mockUseManagementTable.mockReturnValue({
      fieldFilters: {},
      setFieldFilter: vi.fn(),
      clearFieldFilter: vi.fn(),
      filterValue: "",
      setFilterValue: vi.fn(),
      clearFilter: vi.fn(),
    })
    render(<FilterInput label="Test" />)
    expect(screen.getByPlaceholderText(/test/i)).toBeInTheDocument()
  })

  it("renders with value from fieldFilters", () => {
    mockUseManagementTable.mockReturnValue({
      fieldFilters: { name: "foo" },
      setFieldFilter: vi.fn(),
      clearFieldFilter: vi.fn(),
      filterValue: "",
      setFilterValue: vi.fn(),
      clearFilter: vi.fn(),
    })
    render(<FilterInput filterKey={"name" as never} label="Name" />)
    expect(screen.getByDisplayValue("foo")).toBeInTheDocument()
  })

  it("renders with value from filterValue when searchKeys is present", () => {
    mockUseManagementTable.mockReturnValue({
      fieldFilters: {},
      setFieldFilter: vi.fn(),
      clearFieldFilter: vi.fn(),
      filterValue: "bar",
      setFilterValue: vi.fn(),
      clearFilter: vi.fn(),
    })
    render(<FilterInput label="Name" searchKeys={["name"]} />)
    expect(screen.getByDisplayValue("bar")).toBeInTheDocument()
  })
})
