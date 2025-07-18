"use client"

import { ManagementTable } from "@repo/ui/components/Generic"
import { memo } from "react"
import { columns } from "./Columns"

type UserData = {
  id: string
  name: string
  email: string
  role: string
  remaining: string
  university: string
  joined: string
}

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
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
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
            { label: "Admin", value: "admin" },
            { label: "Casual", value: "casual" },
            { label: "Member", value: "member" },
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
            { label: "University of Auckland", value: "university-of-auckland" },
            {
              label: "Auckland University of Technology",
              value: "auckland-university-of-technology",
            },
            { label: "Massey University", value: "massey-university" },
          ],
          label: "University",
          w: "md",
        },
      ]}
      rowId="id"
    />
  )
})

AdminTable.displayName = "AdminTable"
