import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import BookingDataService from "../services/BookingDataService"
import GameSessionDataService from "../services/GameSessionDataService"
import {
  commitCascadeTransaction,
  createTransactionId,
  rollbackCascadeTransaction,
} from "./Transaction"

describe("Transaction", () => {
  const bookingDataService = new BookingDataService()
  const gameSessionDataService = new GameSessionDataService()

  it("should commit several booking deletions successfully in the transaction", async () => {
    const createdGameSession1 =
      await gameSessionDataService.createGameSession(gameSessionCreateMock)
    const createdGameSession2 =
      await gameSessionDataService.createGameSession(gameSessionCreateMock)
    const createdBooking1 = await bookingDataService.createBooking({
      ...bookingCreateMock,
      gameSession: createdGameSession1,
    })
    const createdBooking2 = await bookingDataService.createBooking({
      ...bookingCreateMock,
      gameSession: createdGameSession2,
    })

    const transactionId = await createTransactionId()

    await bookingDataService.deleteBookingsByGameSessionIds(
      [createdGameSession1.id, createdGameSession2.id],
      transactionId,
    )

    await commitCascadeTransaction(transactionId)

    await expect(bookingDataService.getBookingById(createdBooking1.id)).rejects.toThrowError(
      "Not Found",
    )
    await expect(bookingDataService.getBookingById(createdBooking2.id)).rejects.toThrowError(
      "Not Found",
    )
  })

  it("should rollback several booking deletions if error occurs in the transaction", async () => {
    const createdGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule(
      gameSessionScheduleCreateMock,
    )
    const createdGameSession = await gameSessionDataService.createGameSession({
      ...gameSessionCreateMock,
      gameSessionSchedule: createdGameSessionSchedule.id,
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

    vi.spyOn(BookingDataService.prototype, "deleteBookingsByGameSessionIds").mockRejectedValueOnce(
      new Error("Database error"),
    )

    await expect(
      bookingDataService.deleteBookingsByGameSessionIds([createdGameSession.id], transactionId),
    ).rejects.toThrow("Database error")

    await rollbackCascadeTransaction(transactionId)

    expect(
      await gameSessionDataService.getGameSessionScheduleById(createdGameSessionSchedule.id),
    ).toBeDefined()
    expect(await gameSessionDataService.getGameSessionById(createdGameSession.id)).toBeDefined()
    expect(await bookingDataService.getBookingById(createdBooking1.id)).toBeDefined()
    expect(await bookingDataService.getBookingById(createdBooking2.id)).toBeDefined()
  })
})
