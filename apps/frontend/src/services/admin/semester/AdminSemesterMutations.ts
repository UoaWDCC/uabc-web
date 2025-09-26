import type { CreateSemesterRequest, UpdateSemesterRequest } from "@repo/shared/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { QueryKeys } from "@/services"
import AdminSemesterService from "./AdminSemesterService"

/**
 * Provides a mutation hook for creating a new semester and invalidating the semester query cache.
 *
 * @returns A mutation hook for creating a semester.
 */
export const useCreateSemester = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  return useMutation({
    mutationFn: (data: CreateSemesterRequest) =>
      AdminSemesterService.createSemester({ data, token }),
    // TODO: when get by id is implemented, do not invalidate get by id queries
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SEMESTER_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY, QueryKeys.SEMESTER_QUERY_KEY],
      })
    },
  })
}

/**
 * Provides a query hook for updating a semester and invalidating the semester query cache.
 *
 * @returns A mutation hook for updating a semester.
 */
export const useUpdateSemester = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSemesterRequest }) =>
      AdminSemesterService.updateSemester({ id, data, token }),
    // TODO: when get by id is implemented, only invalidate the updated id for get by id or update the specific query with the updated data
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SEMESTER_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY, QueryKeys.SEMESTER_QUERY_KEY],
      })
    },
  })
}

/**
 * Provides a mutation hook for deleting a semester and invalidating the semester query cache.
 *
 * @returns A mutation hook for deleting a semester.
 */
export const useDeleteSemester = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  return useMutation({
    mutationFn: (id: string) => AdminSemesterService.deleteSemester({ id, token }),
    // TODO: when get by id is implemented, only invalidate the updated id for get by id
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SEMESTER_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY, QueryKeys.SEMESTER_QUERY_KEY],
      })
    },
  })
}
