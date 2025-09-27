import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import BookingDataService from "../services/BookingDataService"
import GameSessionDataService from "../services/GameSessionDataService"
import SemesterDataService from "../services/SemesterDataService"
import {
  commitCascadeTransaction,
  createTransactionId,
  rollbackCascadeTransaction,
} from "./Transaction"

describe("Transaction", () => {
  const bookingDataService = new BookingDataService()
  const gameSessionDataService = new GameSessionDataService()
  const semesterDataService = new SemesterDataService()

  it("should commit several booking deletions successfully in the transaction", async () => {
    const createdSemester = await semesterDataService.createSemester(semesterCreateMock)
    const createdGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule({
      ...gameSessionScheduleCreateMock,
      semester: createdSemester,
    })
    const createdGameSession = await gameSessionDataService.createGameSession({
      ...gameSessionCreateMock,
      semester: createdSemester.id, // Use the created semester ID
      gameSessionSchedule: createdGameSessionSchedule,
    })

    const createdBooking1 = await bookingDataService.createBooking({
      ...bookingCreateMock,
      gameSession: createdGameSession,
    })
    const createdBooking2 = await bookingDataService.createBooking({
      ...bookingCreateMock,
      gameSession: createdGameSession,
    })

    const transactionId = await createTransactionId()

    await bookingDataService.deleteBookingsBySemesterId(createdSemester.id, transactionId)

    expect(await bookingDataService.getBookingById(createdBooking1.id)).toBeDefined()
    expect(await bookingDataService.getBookingById(createdBooking2.id)).toBeDefined()

    await commitCascadeTransaction(transactionId)

    await expect(bookingDataService.getBookingById(createdBooking1.id)).rejects.toThrowError(
      "Not Found",
    )
    await expect(bookingDataService.getBookingById(createdBooking2.id)).rejects.toThrowError(
      "Not Found",
    )
  })

  it("should rollback several booking deletions if error occurs in the transaction", async () => {
    const createdSemester = await semesterDataService.createSemester(semesterCreateMock)
    const createdGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule({
      ...gameSessionScheduleCreateMock,
      semester: createdSemester,
    })
    const createdGameSession = await gameSessionDataService.createGameSession({
      ...gameSessionCreateMock,
      semester: createdSemester.id, // Use the created semester ID
      gameSessionSchedule: createdGameSessionSchedule,
    })

    const createdBooking1 = await bookingDataService.createBooking({
      ...bookingCreateMock,
      gameSession: createdGameSession,
    })
    const createdBooking2 = await bookingDataService.createBooking({
      ...bookingCreateMock,
      gameSession: createdGameSession,
    })

    const transactionId = await createTransactionId()

    vi.spyOn(BookingDataService.prototype, "deleteBookingsBySemesterId").mockRejectedValueOnce(
      new Error("Database error"),
    )

    try {
      await bookingDataService.deleteBookingsBySemesterId(createdSemester.id, transactionId)
    } catch {
      await rollbackCascadeTransaction(transactionId)
    }

    expect(await bookingDataService.getBookingById(createdBooking1.id)).toBeDefined()
    expect(await bookingDataService.getBookingById(createdBooking2.id)).toBeDefined()
  })
})
