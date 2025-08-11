import type { SessionItem } from "@repo/shared"
import type { SelectItem } from "@yamada-ui/react"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

// Configure dayjs with timezone support
dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Utility function to convert SessionItem to SelectItem format for QuickBook component
 *
 * This function transforms session data into the format expected by the QuickBook form
 */
export const convertSessionsToSelectItems = (sessions: SessionItem[]): SelectItem[] => {
  return sessions.map((session) => {
    const dayName = dayjs.tz(session.date, "Pacific/Auckland").format("ddd")
    const startTime = session.startTime
    const endTime = session.endTime
    const location = session.name || session.location

    return {
      label: `${dayName} | ${startTime} - ${endTime} | ${location}`,
      value: session.id,
    }
  })
}
