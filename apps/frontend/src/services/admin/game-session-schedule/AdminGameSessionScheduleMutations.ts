import { useMutation, useQueryClient } from "@tanstack/react-query"
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        // TODO: when get by id is implemented, only invalidate the updated id for get by id
        queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY],
      })
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        // TODO: when get by id is implemented, only invalidate the updated id for get by id
        queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY],
      })
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        // TODO: when get by id is implemented, only invalidate the updated id for get by id
        queryKey: [QueryKeys.GAME_SESSION_SCHEDULE_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY],
      })
    },
  })
}
