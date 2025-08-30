import type { UpdateGameSessionRequest } from "@repo/shared/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { QueryKeys } from "@/services"
import AdminGameSessionService from "./AdminGameSessionService"

/**
 * Provides a mutation hook for creating a new game session and invalidates the game session query cache.
 *
 * @returns A mutation hook that creates a game session.
 */
export const useCreateGameSession = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  return useMutation({
    mutationFn: (data: UpdateGameSessionRequest) =>
      AdminGameSessionService.createGameSession({ data, token }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY],
      }),
  })
}

/**
 * Provides a mutation hook for updating a game session and invalidates the game session query cache.
 *
 * @returns A mutation hook that updates a game session.
 */
export const useUpdateGameSession = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGameSessionRequest }) =>
      AdminGameSessionService.updateGameSession({ id, data, token }),
    // TODO: When get by id is implemented, only invalidate the one id for get by id
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY],
      }),
  })
}

/**
 * Provides a mutation hook for deleting a game session and invalidates the game session query cache.
 *
 * @returns A mutation hook that deletes a game session.
 */
export const useDeleteGameSession = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  return useMutation({
    mutationFn: (id: string) => AdminGameSessionService.deleteGameSession(id, token),
    // TODO: When get by id is implemented, only invalidate the one id for get by id
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAME_SESSION_QUERY_KEY],
      }),
  })
}
