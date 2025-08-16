"use client"
import { UpdateSelfRequestSchema } from "@repo/shared"
import type { EditSelfData } from "@repo/shared/types/collections"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import AuthService from "./AuthService"

export function useUpdateSelfMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: EditSelfData) => {
      const parsed = UpdateSelfRequestSchema.parse(data)
      return await AuthService.patchMe(parsed)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })
}
