"use client"

import type { TdProps } from "@yamada-ui/react"
import type { Column, TableProps } from "@yamada-ui/table"
import { Table } from "@yamada-ui/table"
import { useCallback, useMemo } from "react"
import type { FilterBarConfig } from "./Filter"
import { useManagementTable } from "./MemberManagementContext"

export type ManagementTableProps<TData> = {
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

export function ManagementTable<TData>({
  columns,
  rowId,
  emptyStateText = "No data found.",
  emptyStateColumnKey,
}: ManagementTableProps<TData>) {
  const { selectedRows, setSelectedRows, paginatedData, visibleColumns } = useManagementTable<
    TData,
    readonly FilterBarConfig<TData>[]
  >()

  // Filter columns by visibleColumns from context
  const filteredColumns = useMemo(() => {
    return columns.filter((col) => {
      // Support both accessorKey and id for column key
      const key =
        (col as Column<TData> & { accessorKey: string }).accessorKey ||
        (col as Column<TData> & { id: string }).id
      return visibleColumns.includes(key)
    })
  }, [columns, visibleColumns])

  const handleSelectionChange = useCallback(
    (rowSelection: string[]) => {
      setSelectedRows(new Set(rowSelection))
    },
    [setSelectedRows],
  )

  const selectedRowIds = useMemo(() => {
    return Array.from(selectedRows)
  }, [selectedRows])

  const hasData = !!paginatedData?.length

  const emptyRow = useMemo(() => {
    return {
      [rowId]: "__empty__",
      [emptyStateColumnKey ?? columns[0]?.header ?? "empty"]: emptyStateText,
      empty: true,
    } as TData & { empty: true }
  }, [columns, emptyStateText, rowId, emptyStateColumnKey])

  const resolvedData = hasData ? paginatedData : [emptyRow]

  // Compose cellProps to handle empty row
  const composedCellProps = useMemo<TableProps<TData & { empty?: boolean }>["cellProps"]>(() => {
    return ({ column, row }) => {
      const props: TdProps = { verticalAlign: "middle" }

      if (row.original.empty) {
        if (
          (
            column.columnDef as TableProps<TData & { empty?: boolean }>["columns"][number] & {
              accessorKey: keyof TData
            }
          ).accessorKey === emptyStateColumnKey
        ) {
          props.colSpan = visibleColumns.length
          props.textAlign = "center"
          props.color = "muted"
          props.h = "3xs"
        } else {
          props.display = "none"
        }
      } else if (column.columnDef.id === "actions") {
        props.pl = "0"
        props.pr = "xs"
        props.py = "xs"
        props.display = "flex"
        props.justifyContent = "flex-end"
      }

      return props
    }
  }, [visibleColumns, emptyStateColumnKey])

  return (
    <Table<TData & { empty?: boolean }>
      borderCollapse="separate"
      borderWidth="1px"
      cellProps={composedCellProps}
      columns={filteredColumns as Column<TData & { empty?: boolean }>[]}
      data={resolvedData as (TData & { empty?: boolean })[]}
      highlightOnHover={hasData}
      highlightOnSelected={hasData}
      onChangeSelect={handleSelectionChange}
      rounded="md"
      rowId={rowId}
      rowsClickSelect={hasData}
      selectedRowIds={selectedRowIds}
      sx={{ "tbody > tr:last-of-type > td": { borderBottomWidth: "0px" } }}
    />
  )
}

ManagementTable.displayName = "ManagementTable"
