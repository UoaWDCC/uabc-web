import type { PaginationQuery } from "@repo/shared"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { QueryKeys } from "@/services"
import AdminUserService from "./AdminUserService"

/**
 * Retrieves and caches paginated users.
 *
 * @param limit The amount of docs at most to fetch in a page.
 * @param query An optional search query to filter users by.
 * @returns A query hook that fetches a page of users.
 */
export const useGetPaginatedUsers = ({ limit, query }: Omit<PaginationQuery, "page">) => {
  const { token } = useAuth()
  return useInfiniteQuery({
    queryKey: [QueryKeys.USER_QUERY_KEY, query],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await AdminUserService.getPaginatedUsers({
        page: pageParam,
        limit,
        query,
        token,
      })
      return response
    },
    getNextPageParam: (lastPage) => lastPage.data?.nextPage,
    getPreviousPageParam: (firstPage) => firstPage.data?.prevPage,
  })
}
