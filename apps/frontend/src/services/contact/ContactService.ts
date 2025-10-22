import { CommonResponseSchema, type ContactFormData } from "@repo/shared"
import { ApiClient, apiClient } from "@/lib/api/client"

/**
 * Service for managing contact form submissions.
 */
const ContactService = {
  /**
   * Submits a contact form with the provided data.
   *
   * @param data The contact form data to submit
   * @returns A promise that resolves to the API response
   * @throws When the API request fails
   */
  submitContactForm: async (data: ContactFormData) => {
    const response = await apiClient.post("/api/contact", data, CommonResponseSchema)
    return ApiClient.throwIfError(response)
  },
} as const

export default ContactService
