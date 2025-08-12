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
      expect(fetchedSemester).rejects.toThrow("Not Found")
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
