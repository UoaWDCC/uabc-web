import type { PaginationQuery } from "@repo/shared"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import AdminGameSessionScheduleService from "./AdminGameSessionScheduleService"

/**
 * Provides a mutation hook for creating a new game session schedule and invalidates the game session schedule query cache.
 *
 * @returns A mutation hook that creates a game session schedule.
 */
export const useCreateGameSessionSchedule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: AdminGameSessionScheduleService.createGameSessionSchedule,
    // TODO: when get by id is implemented, do not invalidate get by id queries
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
      }),
  })
}

/**
 * Provides a mutation hook for updating a game session schedule and invalidates the game session schedule query cache.
 *
 * @returns A mutation hook that updates a game session schedule.
 */
export const useUpdateGameSessionSchedule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: AdminGameSessionScheduleService.updateGameSessionSchedule,
    // TODO: when get by id is implemented, only invalidate the updated id for get by id, or update the specific query with the updated data
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
      }),
  })
}

/**
 * Provides a mutation hook for deleting a game session schedule and invalidates the game session schedule query cache.
 *
 * @returns A mutation hook that deletes a game session schedule.
 */
export const useDeleteGameSessionSchedule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: AdminGameSessionScheduleService.deleteGameSessionSchedule,
    // TODO: when get by id is implemented, only invalidate the updated id for get by id
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
      }),
  })
}

/**
 * Retrieves and caches paginated game session schedules.
 *
 * @param query The pagination query parameters.
 * @returns A query hook that fetches a page of game session schedules.
 */
export const useGetPaginatedGameSessionSchedules = (query: PaginationQuery) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await AdminGameSessionScheduleService.getPaginatedGameSessionSchedules({
        ...query,
        page: pageParam,
      })
      return response
    },
    getNextPageParam: (lastPage) => lastPage.data?.nextPage,
    getPreviousPageParam: (firstPage) => firstPage.data?.prevPage,
  })
}
