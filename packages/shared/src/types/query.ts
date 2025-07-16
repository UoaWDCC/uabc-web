import type z from "zod"
import type { PaginationQuerySchema } from "../schemas"

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>
