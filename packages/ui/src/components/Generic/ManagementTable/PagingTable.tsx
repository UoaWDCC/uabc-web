import { TableContainer, VStack } from "@yamada-ui/react"
import type { Column } from "@yamada-ui/table"
import { ManagementTable, type TableOptions } from "./Table"
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
  /**
   * Optional props to pass to the table.
   */
  tableProps?: TableOptions
  /**
   * Optional pagination metadata to inform the pagination component.
   */
  paginationMetadata?: {
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  /**
   * If `true`, will show the first and last page buttons in pagination.
   *
   * @default true
   */
  paginationWithEdges?: boolean
}

export function PagingTable<TData>({
  columns,
  rowId,
  emptyStateText,
  emptyStateColumnKey,
  tableProps,
  paginationMetadata,
  paginationWithEdges = true,
}: PagingTableProps<TData>) {
  return (
    <VStack gap="md" w="full">
      <TableContainer>
        <ManagementTable
          columns={columns}
          emptyStateColumnKey={emptyStateColumnKey}
          emptyStateText={emptyStateText}
          rowId={rowId}
          {...tableProps}
        />
      </TableContainer>
      <TablePagination paginationMetadata={paginationMetadata} withEdges={paginationWithEdges} />
    </VStack>
  )
}

PagingTable.displayName = "PagingTable"
