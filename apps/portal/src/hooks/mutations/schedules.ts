import { useMutation } from "@tanstack/react-query"

export const useCreateScheduleMutation = () => {
  const mutation = useMutation({
    mutationFn: async ({ semesterId, body }: { semesterId: number; body: BodyInit }) => {
      const response = await fetch(`/api/semesters/${semesterId}/schedules`, {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error()
      }
    },
  })

  return mutation
}

export const useEditScheduleMutation = () => {
  const mutation = useMutation({
    mutationFn: async ({ id, body }: { id: number; body: BodyInit }) => {
      const response = await fetch(`/api/schedules/${id}`, {
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        await response.text().then((text) => {
          throw new Error(text || "An error has occurred")
        })
      }
    },
  })

  return mutation
}

export const useDeleteScheduleMutation = () => {
  const mutation = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const response = await fetch(`/api/schedules/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        await response.text().then((text) => {
          throw new Error(text || "An error has occurred")
        })
      }
    },
  })

  return mutation
}
