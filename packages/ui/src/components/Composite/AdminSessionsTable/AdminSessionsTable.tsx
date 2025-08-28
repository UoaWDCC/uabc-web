"use client"

import { MembershipType, PlayLevel } from "@repo/shared"
import { ManagementTable } from "@repo/ui/components/Generic"
import { memo } from "react"
import { columns, type SessionData } from "./Columns"

/**
 * A table for admin to manage users in a session.
 */
export const AdminSessionsTable = memo(({ data }: { data: SessionData[] }) => {
  return (
    <ManagementTable
      actions={[
        {
          text: "Edit",
          onClick: (row: SessionData) => {
            console.log("Edit", row)
          },
        },
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
        },
      ]}
      rowId="id"
      showFilterActions={false}
      tableProps={{ selection: false }}
    />
  )
})

AdminSessionsTable.displayName = "AdminSessionsTable"
