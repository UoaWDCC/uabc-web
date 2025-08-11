import { AdminTable, type UserData } from "@repo/ui/components/Composite"
import { useGetPaginatedUsers } from "@/services/admin/user/AdminUserQueries"

export const AdminMembersSection = () => {
  const { data } = useGetPaginatedUsers({
    limit: 20,
    page: 20,
  })

  const userData =
    data?.pages[0].data.docs.map((page) => ({
      id: page.id,
      name: page.firstName + page.lastName,
      email: page.email,
      remaining: String(page.remainingSessions),
      joined: page.createdAt,
      role: page.role,
      university: "todo",
      level: page.playLevel,
    })) ?? []

  return <AdminTable data={userData as UserData[]} />
}
