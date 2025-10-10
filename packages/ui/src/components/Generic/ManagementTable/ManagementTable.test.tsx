import { render, screen } from "@repo/ui/test-utils"
import type { Column } from "@yamada-ui/table"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import type { ReactNode } from "react"
import { FilterActionsProvider } from "./Filter/FilterActionsContext"
import { ManagementTable } from "./ManagementTable"
import type { ColumnConfig } from "./types"

export const createWrapper = ({ children }: { children: ReactNode }) => (
  <NuqsTestingAdapter>
    <FilterActionsProvider>{children}</FilterActionsProvider>
  </NuqsTestingAdapter>
)

describe("ManagementTable", () => {
  const columns: Column<{ id: string; name: string }>[] = [
    { accessorKey: "id", header: "ID", cell: ({ getValue }) => <>{getValue()}</> },
    { accessorKey: "name", header: "Name", cell: ({ getValue }) => <>{getValue()}</> },
  ]
  const columnsConfig: ColumnConfig<{ id: string; name: string }>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
  ]
  const data = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
  ]

  it("should render without actions column if no actions prop", () => {
    render(
      <ManagementTable
        columns={columns}
        columnsConfig={columnsConfig}
        data={data}
        emptyStateColumnKey="id"
        emptyStateText="No data"
        rowId="id"
      />,
      { wrapper: createWrapper },
    )
    expect(screen.getByText("ID")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /actions/i })).not.toBeInTheDocument()
  })

  it("should render with actions column and handle menu actions", async () => {
    const onClick = vi.fn()
    const { user } = render(
      <ManagementTable
        actions={[{ text: "Edit", onClick }]}
        columns={columns}
        columnsConfig={columnsConfig}
        data={data}
        emptyStateColumnKey="id"
        emptyStateText="No data"
        rowId="id"
      />,
      { wrapper: createWrapper },
    )
    const menuButtons = screen.getAllByRole("button", { name: /actions/i })
    await user.click(menuButtons[0])
    const menuItem = await screen.findByText("Edit")
    await user.click(menuItem)
    expect(onClick).toHaveBeenCalledWith(data[0])
  })

  it("should render with empty data and show empty state", () => {
    render(
      <ManagementTable
        columns={columns}
        columnsConfig={columnsConfig}
        data={[]}
        emptyStateColumnKey="id"
        emptyStateText="No data found"
        rowId="id"
      />,
      { wrapper: createWrapper },
    )
    expect(screen.getByText("No data found")).toBeInTheDocument()
  })

  it("should render with empty columnsConfig", () => {
    render(
      <ManagementTable
        columns={columns}
        columnsConfig={[]}
        data={data}
        emptyStateColumnKey="id"
        emptyStateText="No data"
        rowId="id"
      />,
      { wrapper: createWrapper },
    )
    expect(screen.getByRole("table")).toBeInTheDocument()
  })

  it("should render with empty columns", () => {
    render(
      <ManagementTable
        columns={[]}
        columnsConfig={columnsConfig}
        data={data}
        emptyStateColumnKey="id"
        emptyStateText="No data"
        rowId="id"
      />,
      { wrapper: createWrapper },
    )
    expect(screen.getByRole("table")).toBeInTheDocument()
  })

  it("should render with empty columnsConfig and no actions", () => {
    render(
      <ManagementTable
        columns={columns}
        columnsConfig={[]}
        data={data}
        emptyStateColumnKey="id"
        emptyStateText="No data"
        rowId="id"
      />,
      { wrapper: createWrapper },
    )
    expect(screen.getByRole("table")).toBeInTheDocument()
  })

  it("should add actions column key if actions prop is present", () => {
    render(
      <ManagementTable
        actions={[{ text: "Edit", onClick: vi.fn() }]}
        columns={columns}
        columnsConfig={columnsConfig}
        data={data}
        emptyStateColumnKey="id"
        emptyStateText="No data"
        rowId="id"
      />,
      { wrapper: createWrapper },
    )
    expect(screen.getAllByRole("button", { name: /actions/i })).toHaveLength(2)
  })

  it("should pass providerProps.isLoading to ManagementTableProvider", () => {
    render(
      <ManagementTable
        columns={columns}
        columnsConfig={columnsConfig}
        data={data}
        emptyStateColumnKey="id"
        emptyStateText="No data"
        providerProps={{ isLoading: true }}
        rowId="id"
      />,
      { wrapper: createWrapper },
    )
    expect(screen.getByRole("table")).toBeInTheDocument()
  })

  it("should render with filterConfigs prop", () => {
    render(
      <ManagementTable
        columns={columns}
        columnsConfig={columnsConfig}
        data={data}
        emptyStateColumnKey="id"
        emptyStateText="No data"
        filterConfigs={[]}
        rowId="id"
      />,
      { wrapper: createWrapper },
    )
    expect(screen.getByRole("table")).toBeInTheDocument()
  })
})
