import type { z } from "zod"
import type {
  BookingSchema,
  CreateBookingRequestSchema,
  SelectACourtFormDataSchema,
} from "../schemas"

export type BookingType = z.infer<typeof BookingSchema>

export type SelectACourtFormData = z.infer<typeof SelectACourtFormDataSchema>

export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>
