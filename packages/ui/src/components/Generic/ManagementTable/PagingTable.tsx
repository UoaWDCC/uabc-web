import { TableContainer, VStack } from "@yamada-ui/react"
import type { Column } from "@yamada-ui/table"
import { ManagementTable } from "./Table"
import { TablePagination } from "./TablePagination"

type PagingTableProps<TData> = {
  columns: Column<TData>[]
  rowId: keyof TData
  emptyStateText: string
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
