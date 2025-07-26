import type { Weekday } from "@repo/shared"
import type { Semester } from "@repo/shared/payload-types"

const dayToNumber: Record<Weekday, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

export function getWeeklySessionDates(day: Weekday, semester: Semester): Date[] {
  const dates: Date[] = []

  const semesterStart = new Date(semester.startDate)
  const semesterEnd = new Date(semester.endDate)
  const breakStart = new Date(semester.breakStart)
  const breakEnd = new Date(semester.breakEnd)

  const targetDay = dayToNumber[day]
  const sessionDate = new Date(semesterStart)
  const dayOffset = (targetDay - sessionDate.getDay() + 7) % 7
  sessionDate.setDate(sessionDate.getDate() + dayOffset)

  while (sessionDate <= semesterEnd) {
    if (sessionDate < breakStart || sessionDate > breakEnd) {
      dates.push(new Date(sessionDate))
    }

    sessionDate.setDate(sessionDate.getDate() + 7)
  }
  return dates
}
