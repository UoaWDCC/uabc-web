"use client"

import { MembershipType, PlayLevel, University } from "@repo/shared"
import { ManagementTable } from "@repo/ui/components/Generic"
import { memo } from "react"
import { columns, type UserData } from "./Columns"

/**
 * A table for admin to manage users.
 */
export const AdminTable = memo(({ data }: { data: UserData[] }) => {
  return (
    <ManagementTable
      actions={[
        {
          text: "Edit",
          onClick: (row: UserData) => {
            console.log("Edit", row)
          },
        },
        {
          text: "Delete",
          onClick: (row: UserData) => {
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
        { key: "remaining", label: "Remaining" },
        { key: "university", label: "University" },
        { key: "joined", label: "Joined" },
      ]}
      data={data}
      emptyStateColumnKey="name"
      emptyStateText="No users found."
      filterConfigs={[
        {
          key: ["name", "email", "university", "role", "remaining", "joined"],
          type: "text",
          placeholder: "Filter...",
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
          label: "All",
          onChange: () => {
            console.log("onChange")
          },
        },
        {
          key: "university",
          type: "multiselect",
          items: [
            ...Object.values(University).map((university) => ({
              label: university,
              value: university,
            })),
          ],
          label: "University",
          w: "md",
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
          label: "Play Level",
          w: "md",
        },
      ]}
      rowId="id"
    />
  )
})

AdminTable.displayName = "AdminTable"
