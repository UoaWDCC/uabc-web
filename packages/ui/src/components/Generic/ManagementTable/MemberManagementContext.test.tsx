import { MembershipType } from "@repo/shared"
import { act, renderHook } from "@repo/ui/test-utils"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import type { ReactNode } from "react"
import { ManagementTableProvider, useManagementTable } from "./MemberManagementContext"

type Row = { id: string; name: string; role?: string; status?: string }
const mockData: Row[] = [
  { id: "1", name: "Alice", role: MembershipType.ADMIN, status: "active" },
  { id: "2", name: "Bob", role: MembershipType.CASUAL, status: "inactive" },
  { id: "3", name: "Charlie", role: MembershipType.MEMBER, status: "active" },
]

const filterConfigs = [
  {
    type: "multiselect" as const,
    key: "role" as keyof Row,
    label: "Role",
    items: [
      {
        label: MembershipType.ADMIN,
        value: MembershipType.ADMIN as Lowercase<string>,
      },
    ],
  },
]

export const createWrapper = ({ children }: { children: ReactNode }) => (
  <NuqsTestingAdapter>
    <ManagementTableProvider<Row, typeof filterConfigs>
      allColumnKeys={["id", "name", "role", "status"]}
      data={mockData}
      filterConfigs={filterConfigs}
      isLoading={false}
      rowId="id"
    >
      {children}
    </ManagementTableProvider>
  </NuqsTestingAdapter>
)

export const createWrapperNoFilters = ({ children }: { children: ReactNode }) => (
  <NuqsTestingAdapter>
    <ManagementTableProvider<Row, []>
      allColumnKeys={["id", "name", "role", "status"]}
      data={mockData}
      filterConfigs={[]}
      isLoading={false}
      rowId="id"
    >
      {children}
    </ManagementTableProvider>
  </NuqsTestingAdapter>
)

describe("<ManagementTableContext />", () => {
  it("should throw error when used outside provider", () => {
    const originalError = console.error
    console.error = vi.fn()
    expect(() => {
      renderHook(() => useManagementTable<Row, []>())
    }).toThrow("useManagementTable must be used within a ManagementTableProvider")
    console.error = originalError
  })

  it("should provide context values", () => {
    const { result } = renderHook(() => useManagementTable<Row, typeof filterConfigs>(), {
      wrapper: createWrapper,
    })
    expect(result.current.data).toHaveLength(3)
    expect(result.current.filteredData).toHaveLength(3)
    expect(result.current.paginatedData.length).toBeGreaterThan(0)
    expect(typeof result.current.setFilterValue).toBe("function")
    expect(typeof result.current.setCurrentPage).toBe("function")
    expect(typeof result.current.setPerPage).toBe("function")
    expect(typeof result.current.clearFilter).toBe("function")
  })

  it("should filter data by search term", () => {
    const { result } = renderHook(() => useManagementTable<Row, typeof filterConfigs>(), {
      wrapper: createWrapper,
    })
    act(() => {
      result.current.setFilterValue("Alice", ["name"])
    })
    expect(result.current.filteredData.length).toBe(1)
    expect(result.current.filteredData[0].name).toBe("Alice")
  })

  it("should clear filter correctly", () => {
    const { result } = renderHook(() => useManagementTable<Row, typeof filterConfigs>(), {
      wrapper: createWrapper,
    })
    act(() => {
      result.current.setFilterValue("Bob", ["name"])
    })
    expect(result.current.filteredData.length).toBe(1)
    act(() => {
      result.current.clearFilter()
    })
    expect(result.current.filteredData.length).toBe(3)
  })

  it("should handle pagination", () => {
    const { result } = renderHook(() => useManagementTable<Row, typeof filterConfigs>(), {
      wrapper: createWrapper,
    })
    act(() => {
      result.current.setPerPage(2)
    })
    expect(result.current.paginatedData.length).toBe(2)
    act(() => {
      result.current.setCurrentPage(2)
    })
    expect(result.current.paginatedData.length).toBe(1)
    act(() => {
      result.current.setCurrentPage(1)
    })
    expect(result.current.paginatedData.length).toBe(2)
  })

  it("should handle row selection and isRowSelected", () => {
    const { result } = renderHook(() => useManagementTable<Row, typeof filterConfigs>(), {
      wrapper: createWrapper,
    })
    act(() => {
      result.current.setSelectedRows(new Set(["1"]))
    })
    expect(result.current.selectedRows.has("1")).toBe(true)
    expect(result.current.isRowSelected("1")).toBe(true)
    act(() => {
      result.current.clearSelection()
    })
    expect(result.current.selectedRows.size).toBe(0)
    expect(result.current.isRowSelected("1")).toBe(false)
  })

  it("should toggle row selection", () => {
    const { result } = renderHook(() => useManagementTable<Row, typeof filterConfigs>(), {
      wrapper: createWrapper,
    })
    act(() => {
      result.current.toggleRowSelection("2")
    })
    expect(result.current.selectedRows.has("2")).toBe(true)
    act(() => {
      result.current.toggleRowSelection("2")
    })
    expect(result.current.selectedRows.has("2")).toBe(false)
  })

  it("should select all rows and clear selection", () => {
    const { result } = renderHook(() => useManagementTable<Row, typeof filterConfigs>(), {
      wrapper: createWrapper,
    })
    act(() => {
      result.current.setPerPage(3)
      result.current.selectAllRows()
    })
    expect(result.current.selectedRows.size).toBe(3)
    act(() => {
      result.current.clearSelection()
    })
    expect(result.current.selectedRows.size).toBe(0)
  })

  it("should handle fieldFilters and clearFieldFilter", () => {
    const { result } = renderHook(() => useManagementTable<Row, typeof filterConfigs>(), {
      wrapper: createWrapper,
    })
    act(() => {
      result.current.setFieldFilter("role", ["admin"])
    })
    expect(result.current.fieldFilters.role).toEqual(["admin"])
    act(() => {
      result.current.clearFieldFilter("role")
    })
    expect(result.current.fieldFilters.role).toBeUndefined()
  })

  it("should handle column visibility and toggleColumn", () => {
    const { result } = renderHook(() => useManagementTable<Row, typeof filterConfigs>(), {
      wrapper: createWrapper,
    })
    act(() => {
      result.current.setVisibleColumns(["id", "name"])
    })
    expect(result.current.visibleColumns).toEqual(["id", "name"])
    act(() => {
      result.current.toggleColumn("role")
    })
    expect(result.current.visibleColumns).toContain("role")
    act(() => {
      result.current.toggleColumn("role")
    })
    expect(result.current.visibleColumns).not.toContain("role")
  })

  it("should handle setSearchFields", () => {
    const { result } = renderHook(() => useManagementTable<Row, typeof filterConfigs>(), {
      wrapper: createWrapper,
    })
    act(() => {
      result.current.setSearchFields(["name", "role"])
    })
    expect(result.current.searchInFields).toEqual(["name", "role"])
  })

  it("should compute isAllSelected and isIndeterminate", () => {
    const { result } = renderHook(() => useManagementTable<Row, typeof filterConfigs>(), {
      wrapper: createWrapper,
    })
    act(() => {
      result.current.setPerPage(3)
      result.current.selectAllRows()
    })
    expect(result.current.isAllSelected).toBe(true)
    act(() => {
      result.current.toggleRowSelection("1")
    })
    expect(result.current.isIndeterminate).toBe(true)
  })

  it("should compute selectedData", () => {
    const { result } = renderHook(() => useManagementTable<Row, typeof filterConfigs>(), {
      wrapper: createWrapper,
    })
    act(() => {
      result.current.setSelectedRows(new Set(["1", "2"]))
    })
    expect(result.current.selectedData.length).toBe(2)
    expect(result.current.selectedData[0].id).toBe("1")
    expect(result.current.selectedData[1].id).toBe("2")
  })

  it("should call callbacks if provided", () => {
    const onFilterChange = vi.fn()
    const onVisibleColumnsChange = vi.fn()
    const onSelectedRowsChange = vi.fn()
    const onClearSelection = vi.fn()
    const onToggleRowSelection = vi.fn()
    const onCurrentPageChange = vi.fn()
    const onPerPageChange = vi.fn()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NuqsTestingAdapter>
        <ManagementTableProvider<Row, typeof filterConfigs>
          allColumnKeys={["id", "name", "role", "status"]}
          data={mockData}
          filterConfigs={filterConfigs}
          isLoading={false}
          onClearSelection={onClearSelection}
          onCurrentPageChange={onCurrentPageChange}
          onFilterChange={onFilterChange}
          onPerPageChange={onPerPageChange}
          onSelectedRowsChange={onSelectedRowsChange}
          onToggleRowSelection={onToggleRowSelection}
          onVisibleColumnsChange={onVisibleColumnsChange}
          rowId="id"
        >
          {children}
        </ManagementTableProvider>
      </NuqsTestingAdapter>
    )
    const { result } = renderHook(() => useManagementTable<Row, typeof filterConfigs>(), {
      wrapper,
    })
    act(() => {
      result.current.setFilterValue("Alice", ["name"])
      result.current.clearFilter()
      result.current.setVisibleColumns(["id"])
      result.current.setSelectedRows(new Set(["1"]))
      result.current.clearSelection()
      result.current.toggleRowSelection("2")
      result.current.setCurrentPage(2)
      result.current.setPerPage(1)
    })
    expect(onFilterChange).toHaveBeenCalled()
    expect(onVisibleColumnsChange).toHaveBeenCalled()
    expect(onSelectedRowsChange).toHaveBeenCalled()
    expect(onClearSelection).toHaveBeenCalled()
    expect(onToggleRowSelection).toHaveBeenCalled()
    expect(onCurrentPageChange).toHaveBeenCalled()
    expect(onPerPageChange).toHaveBeenCalled()
  })
})
