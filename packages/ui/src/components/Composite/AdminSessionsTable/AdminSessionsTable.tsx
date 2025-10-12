"use client"

import { MembershipType, PlayLevel } from "@repo/shared"
import { ManagementTable } from "@repo/ui/components/Generic"
import { memo } from "react"
import { columns, type SessionData } from "./Columns"

/**
 * A table for admin to manage users in a session.
 */
export interface AdminSessionsTableProps {
  data: SessionData[]
  onChangeSession?: (row: SessionData) => void
}

export const AdminSessionsTable = memo(({ data, onChangeSession }: AdminSessionsTableProps) => {
  return (
    <ManagementTable
      actions={[
        ...(onChangeSession
          ? [
              {
                text: "Change Session",
                onClick: onChangeSession,
              },
            ]
          : []),
        {
          text: "Delete",
          onClick: (row: SessionData) => {
            console.log("Delete", row)
          },
        },
      ]}
      columns={columns}
      columnsConfig={[
        { key: "name", label: "Name", required: true },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "level", label: "Play Level" },
        { key: "sessions", label: "Sessions" },
      ]}
      data={data}
      emptyStateColumnKey="name"
      emptyStateText="No users found."
      filterConfigs={[
        {
          key: ["name", "email"],
          type: "text",
          placeholder: "Search by name or email...",
          variant: "stylised",
        },
        {
          key: "role",
          type: "multiselect",
          items: [
            ...Object.values(MembershipType).map((role) => ({
              label: role,
              value: role,
            })),
          ],
          label: "All Roles",
          onChange: () => {
            console.log("onChange")
          },
          variant: "stylised",
        },
        {
          key: "level",
          type: "multiselect",
          items: [
            ...Object.values(PlayLevel).map((level) => ({
              label: level,
              value: level,
            })),
          ],
          label: "All Play Levels",
          w: "md",
          variant: "stylised",
        },
      ]}
      rowId="id"
      showFilterActions={false}
      tableProps={{ selection: false }}
    />
  )
})

AdminSessionsTable.displayName = "AdminSessionsTable"
