import { AUTH_COOKIE_NAME, PlayLevel, type UpdateBookingRequest } from "@repo/shared"
import {
  gameSessionMock as baseGameSessionMock,
  casualUserMock,
  memberUserMock,
} from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { casualToken, memberToken } from "@/test-config/vitest.setup"
import { PATCH } from "./route"

describe("/api/me/bookings/[id]", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()
  const gameSessionDataService = new GameSessionDataService()

  const dateInFuture = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
  const futureGameSessionMock = {
    ...baseGameSessionMock,
    startTime: dateInFuture,
  }
  const pastGameSessionMock = {
    ...baseGameSessionMock,
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  }

  describe("PATCH", () => {
    it("should return a 401 if token is missing", async () => {
      const res = await PATCH(createMockNextRequest("", "PATCH", {}), {
        params: Promise.resolve({ id: "some-id" }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No token provided" })
    })

    it("should return a 201 if the modified booking is valid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)

      const existingBooking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: futureGameSessionMock,
        user: memberUserMock,
      })

      const res = await PATCH(
        createMockNextRequest("/api/me/bookings/", "PATCH", {
          ...existingBooking,
          gameSession: newGameSession,
          playerLevel: PlayLevel.beginner,
        } satisfies UpdateBookingRequest),
        { params: Promise.resolve({ id: existingBooking.id }) },
      )

      expect(res.status).toBe(StatusCodes.OK)
      const data = (await res.json()).data
      expect(await bookingDataService.getBookingById(data.id)).toBeDefined()
      expect(newGameSession).toStrictEqual(
        (await bookingDataService.getBookingById(data.id)).gameSession,
      )
    })

    it("should return 404 if the target booking does not exist", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const res = await PATCH(createMockNextRequest(), {
        params: Promise.resolve({ id: "non-existing booking" }),
      })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect((await res.json()).error).toBe("Booking not found")
    })

    it("should return 404 if the user doesn't belong to the booking", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const existingBooking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: futureGameSessionMock,
        user: casualUserMock,
      })

      const res = await PATCH(createMockNextRequest(), {
        params: Promise.resolve({ id: existingBooking.id }),
      })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect((await res.json()).error).toBe("Booking not found")
    })

    it("should return a 400 if the booking's game session has already passed", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const gameSession = await gameSessionDataService.createGameSession(pastGameSessionMock)

      const booking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: memberUserMock,
        gameSession,
      })

      const req = createMockNextRequest("/api/me/bookings/", "PATCH", {
        playerLevel: PlayLevel.beginner,
      } satisfies UpdateBookingRequest)
      const res = await PATCH(req, {
        params: Promise.resolve({ id: booking.id }),
      })

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect((await res.json()).error).toBe(
        "The booking game session start time has already passed",
      )
    })

    it("should return a 200 if only a play level update is made", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const gameSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        startTime: dateInFuture,
      })
      const booking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession,
        user: memberUserMock,
      })

      const req = createMockNextRequest("/api/me/bookings/", "PATCH", {
        playerLevel: PlayLevel.intermediate,
      } satisfies UpdateBookingRequest)
      const res = await PATCH(req, {
        params: Promise.resolve({ id: booking.id }),
      })

      expect(res.status).toBe(StatusCodes.OK)
      expect((await bookingDataService.getBookingById(booking.id)).playerLevel).toEqual(
        PlayLevel.intermediate,
      )
    })

    it("should return a 404 if the updated game session doesn't exist", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const gameSession = await gameSessionDataService.createGameSession(futureGameSessionMock)

      const booking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: memberUserMock,
        gameSession,
      })

      const req = createMockNextRequest("/api/me/bookings/", "PATCH", {
        gameSession: "non-existent",
      } satisfies UpdateBookingRequest)
      const res = await PATCH(req, {
        params: Promise.resolve({ id: booking.id }),
      })

      expect(res.status).toBe(StatusCodes.NOT_FOUND)
      expect((await res.json()).error).toBe("The updated booking's game session was not found")
    })

    it("should return a 409 if the user has already made a booking for the session", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const gameSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        startTime: dateInFuture,
      })
      await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession,
        user: casualUserMock,
      })
      const booking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: futureGameSessionMock,
        user: casualUserMock,
      })

      const req = createMockNextRequest("/api/me/bookings/", "PATCH", {
        gameSession,
        playerLevel: PlayLevel.beginner,
      } satisfies UpdateBookingRequest)
      const res = await PATCH(req, { params: Promise.resolve({ id: booking.id }) })

      expect(res.status).toBe(StatusCodes.CONFLICT)
      expect(await res.json()).toStrictEqual({
        error: "A booking with that session has already been made",
      })
    })

    it("should return a 403 if booking a session scheduled before the booking open time", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const gameSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        startTime: dateInFuture,
      })
      const booking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession,
        user: memberUserMock,
      })
      const earlySession = await gameSessionDataService.createGameSession({
        ...futureGameSessionMock,
        openTime: dateInFuture,
      })

      const req = createMockNextRequest("/api/me/bookings/", "PATCH", {
        gameSession: earlySession,
        playerLevel: PlayLevel.beginner,
      } satisfies UpdateBookingRequest)
      const res = await PATCH(req, { params: Promise.resolve({ id: booking.id }) })

      expect(res.status).toBe(StatusCodes.FORBIDDEN)
      expect(await res.json()).toStrictEqual({
        error: "Booking is not open yet for this session",
      })
    })

    it("should return a 403 if the user exceeds booking capacity for casuals", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const existingBooking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: casualUserMock,
      })

      const gameSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        casualCapacity: 0,
      })

      const req = createMockNextRequest("/api/me/bookings/", "PATCH", {
        gameSession,
      } satisfies UpdateBookingRequest)
      const res = await PATCH(req, { params: Promise.resolve({ id: existingBooking.id }) })

      expect(res.status).toBe(StatusCodes.FORBIDDEN)
      expect(await res.json()).toStrictEqual({
        error: "Session is full for the selected user role",
      })
    })

    it("should return a 403 if the user exceeds booking capacity for members", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const existingBooking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: memberUserMock,
      })

      const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: gameSession.id,
      })

      const req = createMockNextRequest("/api/me/bookings/", "PATCH", {
        gameSession: {
          ...gameSession,
          capacity: 1,
        },
        playerLevel: PlayLevel.beginner,
      } satisfies UpdateBookingRequest)
      const res = await PATCH(req, { params: Promise.resolve({ id: existingBooking.id }) })

      expect(res.status).toBe(StatusCodes.FORBIDDEN)
      expect(await res.json()).toStrictEqual({
        error: "Session is full for the selected user role",
      })
    })

    it("should return a 400 if the body is malformed", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const existingBooking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: memberUserMock,
      })

      const req = createMockNextRequest("/api/me/bookings/", "PATCH", {
        playerLevel: "not-a-playLevel",
      })
      const res = await PATCH(req, { params: Promise.resolve({ id: existingBooking.id }) })

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toStrictEqual("Invalid request body")
      expect(json.details).toBeDefined()
    })

    it("should return 500 and handle unexpected errors", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      const mockGetBooking = vi
        .spyOn(BookingDataService.prototype, "getBookingById")
        .mockRejectedValueOnce(new Error("Database error"))

      const res = await PATCH(createMockNextRequest(), { params: Promise.resolve({ id: "test" }) })

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(await res.json()).toStrictEqual({
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      })
      expect(mockGetBooking).toHaveBeenCalled()

      const mockGetGameSession = vi
        .spyOn(GameSessionDataService.prototype, "getGameSessionById")
        .mockRejectedValueOnce(new Error("Database error"))

      const gameSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        startTime: dateInFuture,
      })
      const booking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession,
        user: casualUserMock,
      })

      const req1 = createMockNextRequest("/api/me/bookings/", "PATCH", {
        gameSession: "straight-zhao",
      } satisfies UpdateBookingRequest)
      const res1 = await PATCH(req1, {
        params: Promise.resolve({ id: booking.id }),
      })

      expect(res1.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(await res1.json()).toStrictEqual({
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      })
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2)
      expect(mockGetGameSession).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
      mockGetBooking.mockRestore()
      mockGetGameSession.mockRestore()
    })
  })
})
