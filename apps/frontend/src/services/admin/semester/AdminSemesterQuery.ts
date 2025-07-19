import type { UpdateSemesterRequest } from "@repo/shared/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import AdminSemesterService from "./AdminSemesterService"

const AdminSemesterQuery = {
  /**
   * Provides a mutation hook for creating a new semester and invalidating the semester query cache.
   *
   * @returns A mutation hook for creating a semester.
   */
  useCreateSemester: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: AdminSemesterService.createSemester,
      // TODO: when get by id is implemented, do not invalidate get by id queries
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.SEMESTER_QUERY_KEY],
        }),
    })
  },

  /**
   * Provides a query hook for updating a semester and invalidating the semester query cache.
   *
   * @returns A mutation hook for updating a semester.
   */
  useUpdateSemester: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({
        id,
        semesterData,
      }: {
        id: string
        semesterData: UpdateSemesterRequest
      }) => {
        const response = await AdminSemesterService.updateSemester(id, semesterData)
        return response
      },
      // TODO: when get by id is implemented, only invalidate the updated id for get by id or update the specific query with the updated data
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.SEMESTER_QUERY_KEY],
        }),
    })
  },

  /**
   * Provides a mutation hook for deleting a semester and invalidating the semester query cache.
   *
   * @returns A mutation hook for deleting a semester.
   */
  useDeleteSemester: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: AdminSemesterService.deleteSemester,
      // TODO: when get by id is implemented, only invalidate the updated id for get by id
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.SEMESTER_QUERY_KEY],
        }),
    })
  },
} as const

export default AdminSemesterQuery
