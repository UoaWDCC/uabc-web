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

export function getWeeklySessionDates(
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
  semester: Semester,
): Date[] {
  const dates: Date[] = []

  const semesterStart = new Date(semester.startDate)
  const semesterEnd = new Date(semester.endDate)
  const breakStart = new Date(semester.breakStart)
  const breakEnd = new Date(semester.breakEnd)

  const targetDay = dayToNumber[day]
  const firstSession = new Date(semesterStart)
  const dayOffset = (targetDay - firstSession.getDay() + 7) % 7
  firstSession.setDate(firstSession.getDate() + dayOffset)

  for (
    let current = new Date(firstSession);
    current <= semesterEnd;
    current.setDate(current.getDate() + 7)
  ) {
    if (current < breakStart || current > breakEnd) {
      dates.push(new Date(current))
    }
  }
  return dates
}
