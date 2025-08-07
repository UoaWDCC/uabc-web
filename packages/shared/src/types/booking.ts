import type z from "zod"
import type {
  BookingSchema,
  CreateBookingRequestSchema,
  UpdateBookingRequestSchema,
} from "../schemas"

export type BookingType = z.infer<typeof BookingSchema>

export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>

export type UpdateBookingRequest = z.infer<typeof UpdateBookingRequestSchema>
