"use client"
import type { EditSelfData } from "@repo/shared"
import { UpdateSelfRequestSchema } from "@repo/shared"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import AuthService from "./AuthService"

export function useUpdateSelfMutation() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: EditSelfData) => {
      if (!token) {
        throw new Error("No token provided")
      }
      const parsed = UpdateSelfRequestSchema.parse(data)
      return await AuthService.patchMe(parsed, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me", token] })
    },
  })
}
