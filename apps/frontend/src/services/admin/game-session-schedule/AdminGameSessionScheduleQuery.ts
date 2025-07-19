import type { PaginationQuery, UpdateGameSessionScheduleRequest } from "@repo/shared"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import AdminGameSessionScheduleService from "./AdminGameSessionScheduleService"

const AdminGameSessionScheduleQuery = {
  /**
   * Provides a mutation hook for creating a new game session schedule and invalidates the game session schedule query cache.
   *
   * @returns A mutation hook that creates a game session schedule.
   */
  useCreateGameSessionSchedule: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: AdminGameSessionScheduleService.createGameSessionSchedule,
      // TODO: when get by id is implemented, do not invalidate get by id queries
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
        }),
    })
  },

  /**
   * Retrieves and caches paginated game session schedules.
   *
   * @param query The pagination query parameters.
   * @returns A query hook that fetches all game session schedules.
   */
  useGetAllGameSessionSchedules: (query: PaginationQuery) => {
    return useInfiniteQuery({
      queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
      initialPageParam: 1,
      queryFn: async () => {
        const response = await AdminGameSessionScheduleService.getAllGameSessionSchedules(query)
        return response
      },
      getNextPageParam: (lastPage) => lastPage?.data?.nextPage ?? undefined,
      getPreviousPageParam: (firstPage) => firstPage?.data?.prevPage ?? undefined,
    })
  },

  /**
   * Provides a mutation hook for updating a game session schedule and invalidates the game session schedule query cache.
   *
   * @returns A mutation hook that updates a game session schedule.
   */
  useUpdateGameSessionSchedule: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({
        id,
        gameSessionScheduleData,
      }: {
        id: string
        gameSessionScheduleData: UpdateGameSessionScheduleRequest
      }) => {
        const response = await AdminGameSessionScheduleService.updateGameSessionSchedule(
          id,
          gameSessionScheduleData,
        )
        return response
      },
      // TODO: when get by id is implemented, only invalidate the updated id for get by id, or update the specific query with the updated data
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
        }),
    })
  },

  /**
   * Provides a mutation hook for deleting a game session schedule and invalidates the game session schedule query cache.
   *
   * @returns A mutation hook that deletes a game session schedule.
   */
  useDeleteGameSessionSchedule: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: AdminGameSessionScheduleService.deleteGameSessionSchedule,
      // TODO: when get by id is implemented, only invalidate the updated id for get by id
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
        }),
    })
  },
} as const

export default AdminGameSessionScheduleQuery
