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
import { ManagementTable } from "@repo/ui/components/Generic"
import { Dialog, useDisclosure } from "@yamada-ui/react"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { type FC, memo, useMemo, useState } from "react"
import { CreateMemberPopUp } from "../../Generic/CreateMemberPopUp/CreateMemberPopUp"
import { columns, type UserData } from "./Columns"
import { COLUMNS_CONFIG, FILTER_CONFIGS } from "./constants"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("Pacific/Auckland")

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

  const userData = useMemo(
    () =>
      data.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName || ""}`,
        email: user.email,
        remaining: String(user.remainingSessions),
        joined: dayjs(user.createdAt).format("DD MMM YYYY hh:mm A"),
        role: user.role,
        university: user.university,
        level: user.playLevel,
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
      // TODO: improve the creation of UpdateUserRequest
      const updateUserRequest: UpdateUserRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role as MembershipType,
        phoneNumber: data.phoneNumber,
        playLevel: data.playLevel as PlayLevel,
        gender: data.gender as Gender,
        dietaryRequirements: data.dietaryRequirements,
        studentId: data.studentId,
        studentUpi: data.studentUpi,
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
        data={userData as UserData[]}
        emptyStateColumnKey="name"
        emptyStateText="No users found."
        filterConfigs={FILTER_CONFIGS}
        rowId="id"
      />

      <CreateMemberPopUp
        defaultValues={selectedUser}
        key={selectedUser?.id}
        onClose={() => {
          setSelectedUser(null)
          onCloseEdit()
        }}
        onConfirm={(data) => handleEditConfirm(data)}
        open={openEdit}
        title="Edit Member"
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
