import type { PaginationQuery } from "@repo/shared"
import { useInfiniteQuery } from "@tanstack/react-query"
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
    return useInfiniteQuery({
      queryKey: [QueryKeys.USER_QUERY_KEY],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        const response = await AdminUserService.getAllUsers({
          ...query,
          page: pageParam,
        })
        return response
      },
      getNextPageParam: (lastPage) => lastPage?.data?.nextPage,
      getPreviousPageParam: (firstPage) => firstPage?.data?.prevPage,
    })
  },
} as const

export default AdminUserQuery
