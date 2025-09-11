"use client"

import { ManagementTable } from "@repo/ui/components/Generic"
import { Dialog, useDisclosure } from "@yamada-ui/react"
import { type FC, memo, useState } from "react"
import { CreateMemberPopUp } from "../../Generic/CreateMemberPopUp/CreateMemberPopUp"
import { columns, type UserData } from "./Columns"
import { COLUMNS_CONFIG, FILTER_CONFIGS } from "./constants"

/**
 * Props for admin table component.
 */
export interface AdminTableProps {
  data: UserData[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

/**
 * A table for admin to manage users.
 */
export const AdminTable: FC<AdminTableProps> = memo(({ data, onEdit, onDelete }) => {
  const { open: openEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
  const { open: openDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()

  const [selectedUserData, setSelectedUserData] = useState<UserData | null>(null)

  const handleEditClick = (row: UserData) => {
    setSelectedUserData(row)
    onOpenEdit()
  }

  const handleEditConfirm = () => {
    if (selectedUserData && onEdit) {
      onEdit(selectedUserData.id)
    }
    onCloseEdit()
  }

  const handleDeleteClick = (row: UserData) => {
    setSelectedUserData(row)
    onOpenDelete()
  }

  const handleDeleteConfirm = () => {
    if (selectedUserData && onDelete) {
      onDelete(selectedUserData.id)
    }
    onCloseDelete()
  }

  return (
    <>
      <ManagementTable
        actions={[
          {
            text: "Edit",
            onClick: handleEditClick,
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

      <CreateMemberPopUp
        defaultValues={{
          firstName: selectedUserData?.name,
          lastName: "Pre-filled last name",
          email: selectedUserData?.email,
          phoneNumber: "123456789",
        }}
        onClose={onCloseEdit}
        onConfirm={handleEditConfirm}
        open={openEdit}
      />

      <Dialog
        cancel="Cancel"
        header="Are you sure?"
        onCancel={onCloseDelete}
        onClose={onCloseDelete}
        onSuccess={handleDeleteConfirm}
        open={openDelete}
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
