import z from "zod"
import { BookingQueryType } from "../enums"

export const BookingQuerySchema = z.object({
  type: z.nativeEnum(BookingQueryType).optional(),
})

export const PaginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
  query: z.string().optional(),
  filter: z.string().optional(),
})

export const PaginationDataSchema = z.object({
  totalDocs: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  page: z.number(),
  pagingCounter: z.number(),
  hasPrevPage: z.boolean(),
  hasNextPage: z.boolean(),
  prevPage: z.number().nullable(),
  nextPage: z.number().nullable(),
})
