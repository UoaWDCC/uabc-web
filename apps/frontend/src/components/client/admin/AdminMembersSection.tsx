import { AdminTable, type UserData } from "@repo/ui/components/Composite"
import { Button, Dialog, useDisclosure, useNotice } from "@yamada-ui/react"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { useDeleteUser } from "@/services/admin/user/AdminUserMutations"
import { useGetPaginatedUsers } from "@/services/admin/user/AdminUserQueries"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("Pacific/Auckland")

export const AdminMembersSection = () => {
  const { open: open1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
  const { open: open2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
  const notice = useNotice()

  const deleteUserMutation = useDeleteUser()
  const { data } = useGetPaginatedUsers({
    limit: 20,
    page: 1,
  })

  const handleResetConfirm1 = () => {
    onClose1()
    onOpen2()
  }

  const handleResetConfirm2 = () => {
    onClose2()
    notice({
      title: "TODO: Reset Memberships",
    })
  }

  const userData =
    data?.pages
      .flatMap((page) => page.data.docs)
      .map((page) => ({
        id: page.id,
        name: page.firstName + (page.lastName ? ` ${page.lastName}` : ""),
        email: page.email,
        remaining: String(page.remainingSessions),
        joined: dayjs(page.createdAt).format("h:mm A D MMM YYYY"),
        role: page.role,
        university: page.university,
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
        onSuccess={handleResetConfirm1}
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
        onSuccess={handleResetConfirm2}
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
