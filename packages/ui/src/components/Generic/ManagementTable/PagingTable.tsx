import { TableContainer, VStack } from "@yamada-ui/react"
import type { Column } from "@yamada-ui/table"
import { ManagementTable } from "./Table"
import { TablePagination } from "./TablePagination"

type PagingTableProps<TData> = {
  /**
   * The columns to display in the table.
   */
  columns: Column<TData>[]
  /**
   * The key of the row ID property in the data.
   */
  rowId: keyof TData
  /**
   * The text to display when there is no data.
   */
  emptyStateText: string
  /**
   * The column key to use for the empty state cell.
   */
  emptyStateColumnKey: keyof TData
}

export function PagingTable<TData>({
  columns,
  rowId,
  emptyStateText,
  emptyStateColumnKey,
}: PagingTableProps<TData>) {
  return (
    <VStack gap="md" w="full">
      <TableContainer>
        <ManagementTable
          columns={columns}
          emptyStateColumnKey={emptyStateColumnKey}
          emptyStateText={emptyStateText}
          rowId={rowId}
        />
      </TableContainer>
      <TablePagination />
    </VStack>
  )
}

PagingTable.displayName = "PagingTable"
