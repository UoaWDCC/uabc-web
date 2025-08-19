import type { z } from "zod"
import type {
  BookingSchema,
  CreateBookingRequestSchema,
  QuickBookFormDataSchema,
  QuickBookLocalStorageSchema,
  SelectACourtFormDataSchema,
  UpdateBookingRequestSchema,
} from "../schemas"

export type BookingType = z.infer<typeof BookingSchema>

export type SelectACourtFormData = z.infer<typeof SelectACourtFormDataSchema>

export type QuickBookFormData = z.infer<typeof QuickBookFormDataSchema>

export type QuickBookLocalStorage = z.infer<typeof QuickBookLocalStorageSchema>

export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>

export type UpdateBookingRequest = z.infer<typeof UpdateBookingRequestSchema>
