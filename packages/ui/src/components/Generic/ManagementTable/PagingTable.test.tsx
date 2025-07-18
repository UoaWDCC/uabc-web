import { render, screen } from "@repo/ui/test-utils"
import type { Column } from "@yamada-ui/table"
import { isValidElement } from "react"
import { createWrapper } from "./MemberManagementContext.test"
import { PagingTable } from "./PagingTable"

describe("<PagingTable />", () => {
  const columns: Column<{ id: string }>[] = [
    { accessorKey: "id", header: "ID", cell: ({ getValue }) => <>{getValue()}</> },
  ]

  it("should be a valid React element", () => {
    expect(
      isValidElement(
        <PagingTable
          columns={columns}
          emptyStateColumnKey="id"
          emptyStateText="No data"
          rowId="id"
        />,
      ),
    ).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(PagingTable.displayName).toBe("PagingTable")
  })

  it("should render table with pagination", () => {
    render(
      <PagingTable
        columns={columns}
        emptyStateColumnKey="id"
        emptyStateText="No data"
        rowId="id"
      />,
      {
        wrapper: createWrapper,
      },
    )
    expect(screen.getByRole("table")).toBeInTheDocument()
    expect(screen.getByRole("combobox")).toBeInTheDocument()
    expect(screen.getByRole("navigation")).toBeInTheDocument()
  })
})
