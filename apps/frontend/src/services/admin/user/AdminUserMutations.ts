import type { CreateUserRequest, UpdateUserRequest } from "@repo/shared/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { QueryKeys } from "@/services"
import AdminUserService from "./AdminUserService"

/**
 * Provides a mutation hook for creating a new user and invalidates the user query cache.
 *
 * @returns A mutation hook that creates a user.
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  return useMutation({
    mutationFn: (data: CreateUserRequest) => AdminUserService.createUser({ data, token }),
    // TODO: when get by id is implemented, do not invalidate get by id queries
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER_QUERY_KEY],
      }),
  })
}

/**
 * Provides a mutation hook for updating a user and invalidates the user query cache.
 *
 * @returns A mutation hook that updates a user.
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      AdminUserService.updateUser({ id, data, token }),
    // TODO: When get by id is implemented, only invalidate the one id for get by id or update the specific query with the updated data
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER_QUERY_KEY],
      }),
  })
}

/**
 * Provides a mutation hook for deleting a user and invalidates the user query cache.
 *
 * @returns A mutation hook for deleting a user.
 */
export const useDeleteUser = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const { token } = useAuth()
  return useMutation({
    mutationFn: async (id: string) => {
      if (!token) {
        throw new Error("No token provided")
      }
      return await AdminUserService.deleteUser({ id, token })
    },
    // TODO: When get by id is implemented, only invalidate the one id for get by id
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER_QUERY_KEY],
      }),
  })
}
