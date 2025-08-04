import type z from "zod"
import type { BookingSchema, CreateBookingRequestBodySchema } from "../schemas"

export type BookingType = z.infer<typeof BookingSchema>

export type CreateBookingRequestBodyType = z.infer<typeof CreateBookingRequestBodySchema>

export type SelectACourtFormData = z.infer<typeof SelectACourtFormDataSchema>
