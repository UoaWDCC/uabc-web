"use client"

import type { GameSessionSchedule } from "@repo/shared/types"
import { memo } from "react"
import { ManagementTable, SkeletonTable } from "../../Generic"
import { columns } from "./Columns"

/**
 * AdminSemestersTable props
 */
export type AdminSemestersTableProps = {
  /**
   * Data to display in the table
   */
  data: GameSessionSchedule[]
  /**
   * Whether the table is in a loading state
   */
  isLoading?: boolean
  /**
   * Callback function to edit a row
   */
  onEditRow?: (row: GameSessionSchedule) => void
  /**
   * Callback function to delete a row based on the id
   */
  onDeleteRow?: (row: string) => void
}

export const AdminSemestersTable = memo(
  ({ data, isLoading = false, onEditRow, onDeleteRow }: AdminSemestersTableProps) => {
    if (isLoading) {
      return <SkeletonTable />
    }

    return (
      <ManagementTable
        actions={[
          {
            text: "Edit",
            onClick: (row: GameSessionSchedule) => onEditRow?.(row),
          },
          {
            text: "Delete",
            onClick: (row: GameSessionSchedule) => onDeleteRow?.(row.id),
          },
        ]}
        columns={columns}
        columnsConfig={
          [
            { key: "name", label: "Session Name", required: true },
            { key: "time", label: "Time" },
            { key: "location", label: "Location" },
            { key: "capacity", label: "Capacity" },
            { key: "casualCapacity", label: "Casual Capacity" },
            // biome-ignore lint/suspicious/noExplicitAny: the typings don't support `createColumnHelper`
          ] as any
        }
        data={data}
        emptyStateColumnKey="name"
        emptyStateText="No sessions found."
        rowId="id"
        showFilterActions={false}
        tableProps={{ selection: false }}
      />
    )
  },
)

AdminSemestersTable.displayName = "AdminSemestersTable"
