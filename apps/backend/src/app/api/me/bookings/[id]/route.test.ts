import {
  AUTH_COOKIE_NAME,
  type CreateBookingRequest,
  PlayLevel,
  type UpdateBookingRequest,
  Weekday,
} from "@repo/shared"
import {
  casualUserMock,
  gameSessionMock,
  memberUserMock,
  semesterMock,
  userCreateMock,
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

  describe("PATCH", () => {
    it("should return a 401 if token is missing", async () => {
      const res = await PATCH(createMockNextRequest("", "PATCH", {}), {
        params: Promise.resolve({ id: "some-id" }),
      })
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No token provided" })
    })

    it("should return a 201 if the edit booking is valid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)

      const existingBooking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: memberUserMock,
      })

      const req = createMockNextRequest("/api/me/bookings/", "PATCH", {
        ...existingBooking,
        gameSession: newGameSession,
        playerLevel: PlayLevel.beginner,
      } satisfies UpdateBookingRequest)

      const res = await PATCH(req, { params: Promise.resolve({ id: existingBooking.id }) })
      expect(res.status).toBe(StatusCodes.OK)
      const data = (await res.json()).data
      expect(data.id).toBeDefined()
      expect(await bookingDataService.getBookingById(data.id)).toBeDefined()

      expect(newGameSession).toStrictEqual(
        (await bookingDataService.getBookingById(data.id)).gameSession,
      )
    })

    it("should return a 409 if the user has already made a booking for the session", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: gameSession.id,
        user: casualUserMock,
      })

      const req = createMockNextRequest("/api/me/bookings/", "PATCH", {
        gameSession,
        playerLevel: PlayLevel.beginner,
      } satisfies CreateBookingRequest)
      const res = await PATCH(req, { params: Promise.resolve({ id: gameSession.id }) })

      expect(res.status).toBe(StatusCodes.CONFLICT)
      expect(await res.json()).toStrictEqual({ error: "Session already booked" })
    })

    it("should return a 403 if booking a session scheduled before the booking open time", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const existingBooking = await bookingDataService.createBooking({
        ...bookingCreateMock,
        user: memberUserMock,
      })

      const customSemester = {
        ...semesterMock,
        bookingOpenDay: Weekday.wednesday,
        bookingOpenTime: new Date(Date.UTC(2025, 0, 1, 12, 0, 0)).toISOString(),
      }
      const earlySession = {
        ...gameSessionMock,
        startTime: new Date(Date.UTC(2025, 0, 1, 10, 0, 0)).toISOString(),
        semester: customSemester,
      }

      vi.setSystemTime(new Date(Date.UTC(2025, 0, 1, 13, 0, 0)))

      try {
        const req = createMockNextRequest("/api/me/bookings/", "PATCH", {
          gameSession: earlySession,
          playerLevel: PlayLevel.beginner,
        } satisfies CreateBookingRequest)
        const res = await PATCH(req, { params: Promise.resolve({ id: existingBooking.id }) })

        expect(res.status).toBe(StatusCodes.FORBIDDEN)
        expect(await res.json()).toStrictEqual({
          error: "Booking is not open yet for this session",
        })
      } finally {
        vi.useRealTimers()
      }
    })
  })

  it("should return a 403 if the user is a casual and has exceeded booking capacity", async () => {
    cookieStore.set(AUTH_COOKIE_NAME, casualToken)

    const existingBooking = await bookingDataService.createBooking({
      ...bookingCreateMock,
      user: casualUserMock,
    })

    const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
    await bookingDataService.createBooking({
      ...bookingCreateMock,
      gameSession: gameSession.id,
    })

    const req = createMockNextRequest("/api/me/bookings/", "PATCH", {
      gameSession: {
        ...gameSession,
        casualCapacity: 1,
      },
      playerLevel: PlayLevel.beginner,
    } satisfies CreateBookingRequest)
    const res = await PATCH(req, { params: Promise.resolve({ id: existingBooking.id }) })

    expect(res.status).toBe(StatusCodes.FORBIDDEN)
    expect(await res.json()).toStrictEqual({ error: "Session is full for the selected user role" })
  })

  it("should a 403 if the user is a member and has exceeded booking capacity", async () => {
    cookieStore.set(AUTH_COOKIE_NAME, memberToken)

    const existingBooking = await bookingDataService.createBooking({
      ...bookingCreateMock,
      user: casualUserMock,
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
    } satisfies CreateBookingRequest)
    const res = await PATCH(req, { params: Promise.resolve({ id: existingBooking.id }) })

    expect(res.status).toBe(StatusCodes.FORBIDDEN)
    expect(await res.json()).toStrictEqual({
      error: "Session is full for the selected user role",
    })
  })

  it("should return 400 if request body is invalid", async () => {
    cookieStore.set(AUTH_COOKIE_NAME, memberToken)

    const req = createMockNextRequest("/api/me/bookings/", "PATCH", {
      gameSession: gameSessionCreateMock,
      playerLevel: PlayLevel.beginner,
      user: userCreateMock,
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: "non-existing booking" }) })

    expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    const json = await res.json()
    expect(json.error).toBe("Invalid request body")
    expect(json.details).toBeDefined()
  })

  it("should return 500 for internal server error", async () => {
    cookieStore.set(AUTH_COOKIE_NAME, memberToken)

    const req = createMockNextRequest("/api/me/bookings/", "POST")
    const res = await PATCH(req, { params: Promise.resolve({ id: "non-existing booking" }) })

    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    const json = await res.json()
    expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  })
})
