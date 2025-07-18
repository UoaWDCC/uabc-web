import type { PaginationQuery } from "@repo/shared"
import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import AdminUserService from "./AdminUserService"

const AdminUserQuery = {
  /**
   * Retrieves and caches paginated users.
   *
   * @param query The pagination query parameters.
   * @returns A query hook that fetches all users.
   */
  useGetAllUsers: (query: PaginationQuery) => {
    return useQuery({
      queryKey: [QueryKeys.USER_QUERY_KEY],
      queryFn: () => AdminUserService.getAllUsers(query),
    })
  },
} as const

export default AdminUserQuery
