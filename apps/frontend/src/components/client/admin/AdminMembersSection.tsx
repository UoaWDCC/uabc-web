import { AdminTable, type UserData } from "@repo/ui/components/Composite"
import { Button } from "@yamada-ui/react"
import { useDeleteUser } from "@/services/admin/user/AdminUserMutations"
import { useGetPaginatedUsers } from "@/services/admin/user/AdminUserQueries"

export const AdminMembersSection = () => {
  const deleteUserMutation = useDeleteUser()

  const { data } = useGetPaginatedUsers({
    limit: 20,
    page: 20,
  })

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
          deleteUserMutation.mutate(id)
        }}
      />
      <Button colorScheme="danger" placeSelf="start">
        Reset Memberships
      </Button>
    </>
  )
}
