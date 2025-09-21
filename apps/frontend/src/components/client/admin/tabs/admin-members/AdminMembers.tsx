import { dayjs } from "@repo/shared"
import { AdminTable, type UserData } from "@repo/ui/components/Composite"
import { Button } from "@repo/ui/components/Primitive"
import { Dialog, useDisclosure, useNotice } from "@yamada-ui/react"
import { useMemo } from "react"
import { useDeleteUser } from "@/services/admin/user/AdminUserMutations"
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
  const { data } = useGetPaginatedUsers({
    limit: 20,
    page: 1,
  })

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

  const userData = useMemo(
    () =>
      data?.pages
        .flatMap((page) => page.data.docs)
        .map((page) => ({
          id: page.id,
          name: `${page.firstName} ${page.lastName || ""}`,
          email: page.email,
          remaining: String(page.remainingSessions),
          joined: dayjs(page.createdAt).format("DD MMM YYYY hh:mm A"),
          role: page.role,
          university: page.university,
          level: page.playLevel,
        })) ?? [],
    [data?.pages],
  )

  return (
    <>
      <AdminTable
        data={userData as UserData[]}
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
