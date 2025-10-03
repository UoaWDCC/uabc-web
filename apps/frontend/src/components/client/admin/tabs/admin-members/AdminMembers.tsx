import { AdminTableWithPaginatedQuery } from "@repo/ui/components/Composite"
import { Button } from "@repo/ui/components/Primitive"
import { Dialog, useDisclosure, useNotice } from "@yamada-ui/react"
import { useDeleteUser, useUpdateUser } from "@/services/admin/user/AdminUserMutations"
import { useGetPaginatedUsers } from "@/services/admin/user/AdminUserQueries"

export const AdminMembers = () => {
  const { open: openConfirm, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useDisclosure()
  const {
    open: openFinalConfirm,
    onOpen: onOpenFinalConfirm,
    onClose: onCloseFinalConfirm,
  } = useDisclosure()
  const notice = useNotice()

  const deleteUserMutation = useDeleteUser()
  const updateUserMutation = useUpdateUser()

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
