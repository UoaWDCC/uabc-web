"use client"

import type { User } from "@repo/shared/payload-types"
import type {
  CreateMemberPopUpFormValues,
  Gender,
  MembershipType,
  PlayLevel,
  University,
  UpdateUserRequest,
} from "@repo/shared/types"
import { dayjs } from "@repo/shared/utils"
import { ManagementTable } from "@repo/ui/components/Generic"
import { Dialog, useDisclosure } from "@yamada-ui/react"
import { type FC, memo, useMemo, useState } from "react"
import { CreateMemberPopUp } from "../../Generic/CreateMemberPopUp/CreateMemberPopUp"
import { columns, type UserData } from "./Columns"
import { COLUMNS_CONFIG, FILTER_CONFIGS } from "./constants"

/**
 * Props for admin table component.
 */
export interface AdminTableProps {
  data: User[]
  onEdit?: (id: string, data: UpdateUserRequest) => void
  onDelete?: (id: string) => void
}

/**
 * A table for admin to manage users.
 */
export const AdminTable: FC<AdminTableProps> = memo(({ data, onEdit, onDelete }) => {
  const { open: openEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
  const { open: openDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()

  const userData: UserData[] = useMemo(
    () =>
      data.map((user) => ({
        ...user,
        name: `${user.firstName} ${user.lastName || ""}`,
        remaining: String(user.remainingSessions),
        joined: dayjs(user.createdAt).format("DD MMM YYYY hh:mm A"),
        university: user.university as University,
        level: user.playLevel as PlayLevel,
      })),
    [data],
  )

  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleEditClick = (row: UserData) => {
    const user = data.find((user) => user.id === row.id)
    if (user) {
      setSelectedUser(user)
      onOpenEdit()
    }
  }

  const handleEditConfirm = (data: CreateMemberPopUpFormValues) => {
    if (selectedUser && onEdit) {
      const updateUserRequest: UpdateUserRequest = {
        ...data,
        role: data.role as MembershipType,
        playLevel: data.playLevel as PlayLevel,
        gender: data.gender as Gender,
        university: data.university as University,
      }
      onEdit(selectedUser.id, updateUserRequest)
    }
    onCloseEdit()
  }

  const handleDeleteClick = (row: UserData) => {
    const user = data.find((user) => user.id === row.id)
    if (user) {
      setSelectedUser(user)
      onOpenDelete()
    }
  }

  const handleDeleteConfirm = () => {
    if (selectedUser && onDelete) {
      onDelete(selectedUser.id)
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
        data={userData}
        emptyStateColumnKey="name"
        emptyStateText="No users found."
        filterConfigs={FILTER_CONFIGS}
        rowId="id"
      />

      <CreateMemberPopUp
        key={selectedUser?.id}
        onClose={() => {
          setSelectedUser(null)
          onCloseEdit()
        }}
        onConfirm={(data) => handleEditConfirm(data)}
        open={openEdit}
        title="Edit Member"
        userToEdit={selectedUser}
      />

      <Dialog
        cancel="Cancel"
        header="Are you sure?"
        onCancel={onCloseDelete}
        onClose={() => {
          setSelectedUser(null)
          onCloseDelete()
        }}
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
