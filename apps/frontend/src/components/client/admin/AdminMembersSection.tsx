import { AdminTable, type UserData } from "@repo/ui/components/Composite"
import { Button, Dialog, useDisclosure, useNotice } from "@yamada-ui/react"
import { useDeleteUser } from "@/services/admin/user/AdminUserMutations"
import { useGetPaginatedUsers } from "@/services/admin/user/AdminUserQueries"

export const AdminMembersSection = () => {
  const { open: open1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
  const { open: open2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
  const notice = useNotice()

  const deleteUserMutation = useDeleteUser()
  const { data } = useGetPaginatedUsers({
    limit: 20,
    page: 20,
  })

  const handleResetConfirm = () => {
    notice({
      title: "TODO: Reset Memberships",
    })
  }

  const userData =
    data?.pages[0].data.docs.map((page) => ({
      id: page.id,
      name: page.firstName + (page.lastName ? ` ${page.lastName}` : ""),
      email: page.email,
      remaining: String(page.remainingSessions),
      joined: page.createdAt,
      role: page.role,
      university: "todo",
      level: page.playLevel,
    })) ?? []

  return (
    <>
      <AdminTable
        data={userData as UserData[]}
        onDelete={async (id) => {
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
      <Button colorScheme="danger" onClick={onOpen1} placeSelf="start">
        Reset Memberships
      </Button>
      <Dialog
        cancel="Cancel"
        header="Are you sure?"
        onCancel={onClose1}
        onClose={onClose1}
        onSuccess={onOpen2}
        open={open1}
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
        onCancel={onClose2}
        onClose={onClose2}
        onSuccess={handleResetConfirm}
        open={open2}
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
