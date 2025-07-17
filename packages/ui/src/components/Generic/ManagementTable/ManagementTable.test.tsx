import { render, screen } from "@repo/ui/test-utils"
import type { Column } from "@yamada-ui/table"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { ManagementTable } from "./ManagementTable"
import type { ColumnConfig } from "./types"

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
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )
    expect(screen.getByText("ID")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /actions/i })).not.toBeInTheDocument()
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
      {
        wrapper: withNuqsTestingAdapter(),
      },
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
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )
    // Should still render table (with no columns)
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
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )
    // Should still render table (with no columns)
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
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )
    expect(screen.getByRole("table")).toBeInTheDocument()
  })
})
