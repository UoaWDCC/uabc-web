import type z from "zod"
import type { GameSessionScheduleSchema } from "@/schemas"

export type GameSessionSchedule = z.infer<typeof GameSessionScheduleSchema>
