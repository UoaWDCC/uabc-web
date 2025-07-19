import type { UpdateGameSessionRequest } from "@repo/shared"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import AdminGameSessionService from "./AdminGameSessionService"

const AdminGameSessionScheduleQuery = {
  /**
   * Provides a mutation hook for updating a game session and invalidates the game session query cache.
   *
   * @returns A mutation hook that updates a game session.
   */
  useUpdateGameSession: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({
        id,
        gameSessionData,
      }: {
        id: string
        gameSessionData: UpdateGameSessionRequest
      }) => {
        const response = await AdminGameSessionService.updateGameSession(id, gameSessionData)
        return response
      },
      // TODO: When get by id is implemented, only invalidate the one id for get by id
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY],
        }),
    })
  },

  /**
   * Provides a mutation hook for deleting a game session and invalidates the game session query cache.
   *
   * @returns A mutation hook that deletes a game session.
   */
  useDeleteGameSession: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: AdminGameSessionService.deleteGameSession,
      // TODO: When get by id is implemented, only invalidate the one id for get by id
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY],
        }),
    })
  },
} as const

export default AdminGameSessionScheduleQuery
