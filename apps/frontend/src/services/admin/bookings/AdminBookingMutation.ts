import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import AdminBookingService from "./AdminBookingService"

export const useDeleteBooking = () => {
  const queryClient = useQueryClient()
  useMutation({
    mutationFn: AdminBookingService.deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.MY_BOOKINGS_QUERY_KEY],
      })
    },
  })
}
