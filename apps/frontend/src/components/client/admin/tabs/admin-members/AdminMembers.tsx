import type { CreateUserRequest } from "@repo/shared/types"
import { AdminTableWithPaginatedQuery } from "@repo/ui/components/Composite"
import { useFilterActions } from "@repo/ui/components/Generic/ManagementTable/Filter/FilterActionsContext"
import { Button } from "@repo/ui/components/Primitive"
import { Dialog, useDisclosure, useNotice } from "@yamada-ui/react"
import { useCallback, useEffect } from "react"
import { buildCsvFromRecords } from "@/lib/csv"
import { downloadCsvFile } from "@/lib/file-download"
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from "@/services/admin/user/AdminUserMutations"
import { useGetPaginatedUsers } from "@/services/admin/user/AdminUserQueries"

export const AdminMembers = () => {
  const notice = useNotice()

  const { open: openConfirm, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useDisclosure()
  const {
    open: openFinalConfirm,
    onOpen: onOpenFinalConfirm,
    onClose: onCloseFinalConfirm,
  } = useDisclosure()

  const createUserMutation = useCreateUser()
  // const getUsersByIdsMutation = useGetUsersByIds() // TODO: un-eff this
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const { setAddMember, setExportData } = useFilterActions()

  const handleResetConfirm = () => {
    onCloseConfirm()
    onOpenFinalConfirm()
  }

  const handleResetFinalConfirm = () => {
    onCloseFinalConfirm()
    notice({
      title: "TODO: Reset Memberships",
    })
  }

  const createUser = useCallback(
    (data: CreateUserRequest) => {
      createUserMutation.mutate(data, {
        onSuccess: () => {
          notice({
            title: "Creation successful",
            description: "User has been created",
            status: "success",
          })
        },
        onError: () => {
          notice({
            title: "Creation failed",
            description: "Failed to create user",
            status: "error",
          })
        },
      })
    },
    [createUserMutation.mutate, notice],
  )

  const exportData = useCallback((selectedRows: Set<string>) => {
    console.log(selectedRows)

    const csvContent = buildCsvFromRecords([])
    const filename = "uabc-members.csv"

    downloadCsvFile(csvContent, filename)
  }, [])

  useEffect(() => {
    setAddMember(() => createUser)
    setExportData(() => exportData)
  }, [setAddMember, createUser, setExportData, exportData])

  return (
    <>
      <AdminTableWithPaginatedQuery
        onDelete={(id) => {
          deleteUserMutation.mutate(id, {
            onSuccess: () => {
              notice({
                title: "Deletion successful",
                description: "User has been deleted",
                status: "success",
              })
            },
            onError: () => {
              notice({
                title: "Deletion failed",
                description: "Failed to delete user",
                status: "error",
              })
            },
          })
        }}
        onEdit={(id, data) => {
          updateUserMutation.mutate(
            { id, data },
            {
              onSuccess: () => {
                notice({
                  title: "Update successful",
                  description: "User has been updated",
                  status: "success",
                })
              },
              onError: () => {
                notice({
                  title: "Update failed",
                  description: "Failed to update user",
                  status: "error",
                })
              },
            },
          )
        }}
        paginationWithEdges={false}
        useGetPaginatedData={useGetPaginatedUsers}
      />
      <Button colorScheme="danger" onClick={onOpenConfirm} placeSelf="start">
        Reset Memberships
      </Button>
      <Dialog
        cancel="Cancel"
        header="Are you sure?"
        onCancel={onCloseConfirm}
        onClose={onCloseConfirm}
        onSuccess={handleResetConfirm}
        open={openConfirm}
        success={{
          children: "Reset",
          colorScheme: "danger",
        }}
      >
        This will reset all memberships. You cannot undo this action.
      </Dialog>
      <Dialog
        cancel="Cancel"
        header="Are you really sure?"
        onCancel={onCloseFinalConfirm}
        onClose={onCloseFinalConfirm}
        onSuccess={handleResetFinalConfirm}
        open={openFinalConfirm}
        success={{
          children: "Reset",
          colorScheme: "danger",
        }}
      >
        This will reset all memberships. You cannot undo this action.
      </Dialog>
    </>
  )
}
