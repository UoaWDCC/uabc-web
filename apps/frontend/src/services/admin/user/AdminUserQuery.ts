import type { PaginationQuery, UpdateUserRequest } from "@repo/shared"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import AdminUserService from "./AdminUserService"

const AdminUserQuery = {
  /**
   * Provides a mutation hook for creating a new user and invalidates the user query cache.
   *
   * @returns A mutation hook that creates a user.
   */
  useCreateUser: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: AdminUserService.createUser,
      // TODO: when get by id is implemented, do not invalidate get by id queries
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.USER_QUERY_KEY],
        }),
    })
  },

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
      getNextPageParam: (lastPage) => lastPage?.data?.nextPage ?? undefined,
      getPreviousPageParam: (firstPage) => firstPage?.data?.prevPage ?? undefined,
    })
  },

  /**
   * Provides a mutation hook for updating a user and invalidates the user query cache.
   *
   * @returns A mutation hook that updates a user.
   */
  useUpdateUser: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, userData }: { id: string; userData: UpdateUserRequest }) => {
        const response = await AdminUserService.updateUser(id, userData)
        return response
      },
      // TODO: When get by id is implemented, only invalidate the one id for get by id or update the specific query with the updated data
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.USER_QUERY_KEY],
        }),
    })
  },

  /**
   * Provides a mutation hook for deleting a user and invalidates the user query cache.
   *
   * @returns A mutation hook for deleting a user.
   */
  useDeleteUser: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: AdminUserService.deleteUser,
      // TODO: When get by id is implemented, only invalidate the one id for get by id
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.USER_QUERY_KEY],
        }),
    })
  },
} as const

export default AdminUserQuery
