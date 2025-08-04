import type z from "zod"
import type { BookingSchema, CreateBookingRequestSchema } from "../schemas"

export type BookingType = z.infer<typeof BookingSchema>

export type CreateBookingRequestBodyType = z.infer<typeof CreateBookingRequestBodySchema>

export type SelectACourtFormData = z.infer<typeof SelectACourtFormDataSchema>

export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>
