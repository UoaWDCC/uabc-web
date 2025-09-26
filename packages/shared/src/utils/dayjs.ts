import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

// Extend dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

// Set default timezone to New Zealand
dayjs.tz.setDefault("Pacific/Auckland")

export { dayjs }

export type { Dayjs } from "dayjs"
