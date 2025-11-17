"use client"

import { ManagementTable } from "@repo/ui/components/Generic"
import { memo } from "react"
import { columns, type SemesterSessionRow } from "./Columns"

export interface AdminSemestersTableProps {
  data: SemesterSessionRow[]
  onEditRow?: (row: SemesterSessionRow) => void
  onDeleteRow?: (row: SemesterSessionRow) => void
}

/**
 * A table for admin to view sessions grouped under a semester (desktop).
 */
export const AdminSemestersTable = memo(
  ({ data, onEditRow, onDeleteRow }: AdminSemestersTableProps) => {
    return (
      <ManagementTable
        actions={[
          {
            text: "Edit",
            onClick: (row: SemesterSessionRow) => onEditRow?.(row),
          },
          {
            text: "Delete",
            onClick: (row: SemesterSessionRow) => onDeleteRow?.(row),
          },
        ]}
        columns={columns}
        columnsConfig={[
          { key: "sessionName", label: "Session Name", required: true },
          { key: "time", label: "Time" },
          { key: "sessionType", label: "Session Type" },
        ]}
        data={data}
        emptyStateColumnKey="sessionName"
        emptyStateText="No sessions found."
        filterConfigs={[]}
        rowId="id"
        showFilterActions={false}
        tableProps={{ selection: false }}
      />
    )
  },
)

AdminSemestersTable.displayName = "AdminSemestersTable"
