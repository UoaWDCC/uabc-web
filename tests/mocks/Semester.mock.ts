import { CreateSemesterData, UpdateSemesterData } from '@/types/collections'

export const semesterCreateMock: CreateSemesterData = {
  name: 'Semester 2 2025',
  startDate: new Date('2025-07-01').toISOString(),
  endDate: new Date('2025-11-30').toISOString(),
  breakStart: new Date('2025-09-01').toISOString(),
  breakEnd: new Date('2025-09-14').toISOString(),
  bookingOpenDay: 'monday',
  bookingOpenTime: new Date('2025-08-05T09:00:00Z').toISOString(),
}

export const semesterUpdateMock: UpdateSemesterData = {
  name: 'Semester 1 2026',
  bookingOpenDay: 'wednesday',
}
