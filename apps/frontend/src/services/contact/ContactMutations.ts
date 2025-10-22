import { useMutation } from "@tanstack/react-query"
import { useNotice } from "@yamada-ui/react"
import ContactService from "@/services/contact/ContactService"

/**
 * Custom hook for handling contact form mutations
 */
export const useContactMutation = () => {
  const notice = useNotice()

  return useMutation({
    mutationFn: ContactService.submitContactForm,
    onSuccess: () => {
      notice({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
        status: "success",
      })
    },
    onError: (error) => {
      notice({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Please try again later.",
        status: "error",
      })
    },
  })
}
