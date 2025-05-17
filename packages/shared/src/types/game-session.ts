import type { PlayLevel } from "./enums"

export interface CartGameSession {
  id: number
  weekday: string
  startTime: string
  endTime: string
  locationName: string
  locationAddress: string
  isFull: boolean
  playLevel?: PlayLevel
}
