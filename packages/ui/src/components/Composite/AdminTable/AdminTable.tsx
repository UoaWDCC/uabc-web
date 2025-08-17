"use client"

import { ManagementTable } from "@repo/ui/components/Generic"
import { Dialog, useDisclosure } from "@yamada-ui/react"
import { type FC, memo, useState } from "react"
import { columns, type UserData } from "./Columns"
import { COLUMNS_CONFIG, FILTER_CONFIGS } from "./constants"

export interface AdminTableProps {
  data: UserData[]
  onDelete?: (id: string) => Promise<void>
}

/**
 * A table for admin to manage users.
 */
export const AdminTable: FC<AdminTableProps> = memo(({ data, onDelete }) => {
  const { open, onOpen, onClose } = useDisclosure()
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)

  const handleDeleteClick = (row: UserData) => {
    setSelectedUser(row)
    onOpen()
  }

  const handleDeleteConfirm = () => {
    if (selectedUser && onDelete) {
      onDelete(selectedUser.id)
    }
    onClose()
  }

  return (
    <>
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
            onClick: handleDeleteClick,
          },
        ]}
        columns={columns}
        columnsConfig={COLUMNS_CONFIG}
        data={data}
        emptyStateColumnKey="name"
        emptyStateText="No users found."
        filterConfigs={FILTER_CONFIGS}
        rowId="id"
      />

      <Dialog
        cancel="Cancel"
        header="Are you sure?"
        onCancel={onClose}
        onClose={onClose}
        onSuccess={handleDeleteConfirm}
        open={open}
        success={{
          children: "Delete",
          colorScheme: "danger",
        }}
      >
        You cannot undo this action.
      </Dialog>
    </>
  )
})

AdminTable.displayName = "AdminTable"
