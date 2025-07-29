import type { GameSessionSchedule, Weekday } from "@repo/shared"
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

export function createGameSessionTimes(schedule: GameSessionSchedule, date: Date) {
  const dateStr = date.toISOString().split("T")[0]
  const timeStrStart = schedule.startTime.split("T")[1]
  const timeStrEnd = schedule.endTime.split("T")[1]

  const start = new Date(`${dateStr}T${timeStrStart}`).toISOString()
  const end = new Date(`${dateStr}T${timeStrEnd}`).toISOString()

  return { startTime: start, endTime: end }
}
