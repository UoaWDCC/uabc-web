import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import AdminSemesterService from "./AdminSemesterService"

/**
 * Provides a mutation hook for creating a new semester and invalidating the semester query cache.
 *
 * @returns A mutation hook for creating a semester.
 */
export const useCreateSemester = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: AdminSemesterService.createSemester,
    // TODO: when get by id is implemented, do not invalidate get by id queries
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SEMESTER_QUERY_KEY],
      }),
  })
}

/**
 * Provides a query hook for updating a semester and invalidating the semester query cache.
 *
 * @returns A mutation hook for updating a semester.
 */
export const useUpdateSemester = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: AdminSemesterService.updateSemester,
    // TODO: when get by id is implemented, only invalidate the updated id for get by id or update the specific query with the updated data
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SEMESTER_QUERY_KEY],
      }),
  })
}

/**
 * Provides a mutation hook for deleting a semester and invalidating the semester query cache.
 *
 * @returns A mutation hook for deleting a semester.
 */
export const useDeleteSemester = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: AdminSemesterService.deleteSemester,
    // TODO: when get by id is implemented, only invalidate the updated id for get by id
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SEMESTER_QUERY_KEY],
      }),
  })
}
