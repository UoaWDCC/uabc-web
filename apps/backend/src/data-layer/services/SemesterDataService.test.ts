import { payload } from "@/data-layer/adapters/Payload"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import BookingDataService from "./BookingDataService"
import GameSessionDataService from "./GameSessionDataService"
import SemesterDataService from "./SemesterDataService"

const semesterDataService = new SemesterDataService()
const gameSessionDataService = new GameSessionDataService()
const bookingDataService = new BookingDataService()

describe("SemesterDataService", () => {
  describe("createSemester", () => {
    it("should create a semester document", async () => {
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const fetchedSemester = await payload.findByID({
        collection: "semester",
        id: newSemester.id,
      })
      expect(newSemester).toStrictEqual(fetchedSemester)
    })
  })

  describe("getSemesterById", () => {
    it("should get a semester by ID", async () => {
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const fetchedSemester = await semesterDataService.getSemesterById(newSemester.id)
      expect(newSemester).toEqual(fetchedSemester)
    })

    it("should return null for non-existent ID", async () => {
      const fetchedSemester = semesterDataService.getSemesterById("nonexistentid")
      await expect(fetchedSemester).rejects.toThrow("Not Found")
    })
  })

  describe("getAllSemesters", () => {
    it("should get all semesters", async () => {
      const semester1 = await semesterDataService.createSemester(semesterCreateMock)
      const semester2 = await semesterDataService.createSemester(semesterCreateMock)
      const fetchedSemesters = await semesterDataService.getAllSemesters()
      expect(fetchedSemesters.length).toStrictEqual(2)
      expect(fetchedSemesters).toStrictEqual(expect.arrayContaining([semester2, semester1]))
    })
  })

  describe("getCurrentSemester", () => {
    it("should return the current semester when one exists", async () => {
      const currentDate = new Date()
      const startDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000) // 1 day ago
      const endDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) // 1 day from now

      const currentSemesterData = {
        ...semesterCreateMock,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }

      const createdSemester = await semesterDataService.createSemester(currentSemesterData)
      const currentSemester = await semesterDataService.getCurrentSemester()

      expect(currentSemester).toEqual(createdSemester)
    })

    it("should throw error when no current semester exists", async () => {
      // Create a semester that's in the past
      const pastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      const pastSemesterData = {
        ...semesterCreateMock,
        startDate: new Date(pastDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        endDate: pastDate.toISOString(),
      }

      await semesterDataService.createSemester(pastSemesterData)

      await expect(semesterDataService.getCurrentSemester()).rejects.toThrow(
        "No current semester found",
      )
    })

    it("should return a valid current semester when multiple current semesters exist", async () => {
      const currentDate = new Date()
      const startDate1 = new Date(currentDate.getTime() - 48 * 60 * 60 * 1000) // 2 days ago
      const endDate1 = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) // 1 day from now
      const startDate2 = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000) // 1 day ago
      const endDate2 = new Date(currentDate.getTime() + 48 * 60 * 60 * 1000) // 2 days from now

      const semester1Data = {
        ...semesterCreateMock,
        name: "Semester 1",
        startDate: startDate1.toISOString(),
        endDate: endDate1.toISOString(),
      }

      const semester2Data = {
        ...semesterCreateMock,
        name: "Semester 2",
        startDate: startDate2.toISOString(),
        endDate: endDate2.toISOString(),
      }

      const createdSemester1 = await semesterDataService.createSemester(semester1Data)
      const createdSemester2 = await semesterDataService.createSemester(semester2Data)

      const currentSemester = await semesterDataService.getCurrentSemester()

      // Should return one of the valid current semesters
      const validSemesters = [createdSemester1, createdSemester2]
      expect(validSemesters).toContainEqual(currentSemester)

      // Verify that the returned semester is indeed current
      const currentDateISO = currentDate.toISOString()
      expect(currentSemester.startDate <= currentDateISO).toBe(true)
      expect(currentSemester.endDate >= currentDateISO).toBe(true)
    })

    it("should handle semester boundaries correctly", async () => {
      const currentDate = new Date()

      // Create a semester where current date is exactly at the start
      const exactStartSemesterData = {
        ...semesterCreateMock,
        name: "Exact Start Semester",
        startDate: currentDate.toISOString(),
        endDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      }

      const createdSemester = await semesterDataService.createSemester(exactStartSemesterData)
      const currentSemester = await semesterDataService.getCurrentSemester()

      expect(currentSemester).toEqual(createdSemester)
    })
  })

  describe("updateSemester", () => {
    it("should update semester fields", async () => {
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const updatedSemester = await semesterDataService.updateSemester(newSemester.id, {
        name: "test",
        bookingOpenDay: "wednesday",
      })
      expect(updatedSemester.name).toStrictEqual("test")
      expect(updatedSemester.bookingOpenDay).toStrictEqual("wednesday")
    })

    it("should return null when updating non-existent semester", async () => {
      const updateNotFoundSemester = semesterDataService.updateSemester("nonexistentid", {
        name: "test",
        bookingOpenDay: "wednesday",
      })
      await expect(updateNotFoundSemester).rejects.toThrow("Not Found")
    })
  })

  describe("deleteSemester", () => {
    it("should delete a semester", async () => {
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const deletedSemester = await semesterDataService.deleteSemester(newSemester.id)
      await expect(semesterDataService.getSemesterById(deletedSemester.id)).rejects.toThrow(
        "Not Found",
      )
    })

    it("should return null when deleting non-existent semester", async () => {
      await expect(semesterDataService.deleteSemester("nonexistentid")).rejects.toThrow("Not Found")
    })
  })

  describe("deleteRelatedDocsForSemester", () => {
    it("should delete a semester and related documents", async () => {
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)

      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule({
        ...gameSessionScheduleCreateMock,
        semester: newSemester,
      })
      const newGameSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        gameSessionSchedule: newGameSessionSchedule,
      })
      const newBooking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: newGameSession,
      })

      await semesterDataService.deleteRelatedDocsForSemester(newSemester.id)

      await expect(
        gameSessionDataService.getGameSessionScheduleById(newGameSessionSchedule.id),
      ).rejects.toThrowError("Not Found")
      await expect(
        gameSessionDataService.getGameSessionById(newGameSession.id),
      ).rejects.toThrowError("Not Found")
      await expect(bookingDataService.getBookingById(newBooking.id)).rejects.toThrowError(
        "Not Found",
      )
    })
  })
})
