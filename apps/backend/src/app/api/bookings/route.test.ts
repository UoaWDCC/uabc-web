import {
  AUTH_COOKIE_NAME,
  type CreateBookingRequest,
  MembershipType,
  PlayLevel,
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
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock, futureBookingCreateMock } from "@/test-config/mocks/Booking.mock"
import {
  futureGameSessionCreateMock,
  gameSessionCreateMock,
} from "@/test-config/mocks/GameSession.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { GET, POST } from "./route"

describe("/api/bookings", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()
  const gameSessionDataService = new GameSessionDataService()
  const userDataService = new UserDataService()

  describe("GET", () => {
    it("should return a 401 if token is missing", async () => {
      const res = await GET(createMockNextRequest())
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No token provided" })
    })

    it("should return all paginated game sessions if no query type is set", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const bookingsToCreate = [
        ...Array.from({ length: 15 }, (_, _i) => ({
          ...bookingCreateMock,
        })),
        futureBookingCreateMock,
      ]
      await Promise.all(bookingsToCreate.map((u) => bookingDataService.createBooking(u)))

      const req = createMockNextRequest("/api/bookings?limit=10&page=2")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.docs.length).toBeLessThanOrEqual(10)
      expect(json.data.page).toBe(2)
      expect(json.data.limit).toBe(10)
      expect(json.data.totalDocs).toBeGreaterThanOrEqual(16)
      expect(json.data.totalPages).toBeGreaterThanOrEqual(2)
    })

    it("should return all future paginated game sessions if query type is set to future", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const { id } = await gameSessionDataService.createGameSession(futureGameSessionCreateMock)

      const bookingsToCreate = [
        ...Array.from({ length: 15 }, (_, _i) => ({
          ...bookingCreateMock,
        })),
        {
          ...futureBookingCreateMock,
          gameSession: id,
        },
      ]
      await Promise.all(bookingsToCreate.map((u) => bookingDataService.createBooking(u)))

      const req = createMockNextRequest("/api/bookings?limit=10&page=1&type=future")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.docs.length).toBe(1)
      expect(json.data.page).toBe(1)
      expect(json.data.limit).toBe(10)
      expect(json.data.docs[0].gameSession).toBe(id)
      expect(new Date(json.data.docs[0].startTime).getTime()).toBeGreaterThan(Date.now())
    })

    it("should use default pagination if params are not specified", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const bookingsToCreate = [
        ...Array.from({ length: 15 }, (_, _i) => ({
          ...bookingCreateMock,
        })),
        futureBookingCreateMock,
      ]
      await Promise.all(bookingsToCreate.map((u) => bookingDataService.createBooking(u)))

      const req = createMockNextRequest("/api/bookings")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.OK)
      const json = await res.json()
      expect(json.data.page).toBe(1)
      expect(json.data.limit).toBe(10)
    })

    it("should return 400 if limit or page is out of range", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const req = createMockNextRequest("/api/bookings?limit=999&page=-5")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toBe("Invalid query parameters")
      expect(json.details).toBeDefined()
    })

    it("should return 400 if query params are invalid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const req = createMockNextRequest("/api/bookings?limit=abc&page=def&type=type")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      const json = await res.json()
      expect(json.error).toBe("Invalid query parameters")
      expect(json.details).toBeDefined()
    })

    it("should handle errors and return 500 status", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      vi.spyOn(BookingDataService.prototype, "getPaginatedBookings").mockRejectedValueOnce(
        new Error("Database error"),
      )

      const req = createMockNextRequest("/api/bookings?limit=10&page=1&type=future")
      const res = await GET(req)

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await res.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    })
  })

  describe("POST", () => {
    it("should return a 401 if token is missing", async () => {
      const res = await POST(createMockNextRequest())
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No token provided" })
    })

    it("should return a 201 if the booking is valid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const remainingSessions = memberUserMock.remainingSessions ?? 0
      const newRemainingSessions = remainingSessions - 1

      const req = createMockNextRequest("/api/bookings", "POST", {
        gameSession,
        playerLevel: PlayLevel.beginner,
      } satisfies CreateBookingRequest)

      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.CREATED)
      const data = (await res.json()).data
      expect(data.id).toBeDefined()
      expect(await bookingDataService.getBookingById(data.id)).toBeDefined()

      const user = await userDataService.getUserById(memberUserMock.id)
      expect(user.remainingSessions).toBe(newRemainingSessions)

      if (newRemainingSessions <= 0) {
        expect(user.role).toBe(MembershipType.casual)
      }
    })

    it("should return a 409 if the user has already made a booking for the session", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: gameSession.id,
        user: casualUserMock,
      })

      const req = createMockNextRequest("/api/bookings", "POST", {
        gameSession,
        playerLevel: PlayLevel.beginner,
      } satisfies CreateBookingRequest)
      const res = await POST(req)

      expect(res.status).toBe(StatusCodes.CONFLICT)
      expect(await res.json()).toStrictEqual({ error: "Session already booked" })
    })

    it("should return a 403 if the user has no remaining sessions", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      await userDataService.updateUser(casualUserMock.id, {
        remainingSessions: -1,
      })

      const req = createMockNextRequest("", "POST", {
        gameSession,
        playerLevel: PlayLevel.beginner,
      } satisfies CreateBookingRequest)
      const res = await POST(req)

      expect(res.status).toBe(StatusCodes.FORBIDDEN)
      expect(await res.json()).toStrictEqual({ error: "No remaining sessions" })
    })

    it("should return a 403 if booking a session scheduled before the booking open time", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
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
        const req = createMockNextRequest("/api/bookings", "POST", {
          gameSession: earlySession,
          playerLevel: PlayLevel.beginner,
        } satisfies CreateBookingRequest)
        const res = await POST(req)

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
    const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
    await bookingDataService.createBooking({
      ...bookingCreateMock,
      gameSession: gameSession.id,
    })

    const req = createMockNextRequest("", "POST", {
      gameSession: {
        ...gameSession,
        casualCapacity: 1,
      },
      playerLevel: PlayLevel.beginner,
    } satisfies CreateBookingRequest)
    const res = await POST(req)

    expect(res.status).toBe(StatusCodes.FORBIDDEN)
    expect(await res.json()).toStrictEqual({ error: "Session is full for the selected user role" })
  })

  it("should a 403 if the user is a member and has exceeded booking capacity", async () => {
    cookieStore.set(AUTH_COOKIE_NAME, memberToken)
    const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
    await bookingDataService.createBooking({
      ...bookingCreateMock,
      gameSession: gameSession.id,
    })

    const req = createMockNextRequest("", "POST", {
      gameSession: {
        ...gameSession,
        capacity: 1,
      },
      playerLevel: PlayLevel.beginner,
    } satisfies CreateBookingRequest)
    const res = await POST(req)

    expect(res.status).toBe(StatusCodes.FORBIDDEN)
    expect(await res.json()).toStrictEqual({
      error: "Session is full for the selected user role",
    })
  })

  it("should return 400 if request body is invalid", async () => {
    cookieStore.set(AUTH_COOKIE_NAME, adminToken)

    const req = createMockNextRequest("", "POST", {
      gameSession: gameSessionCreateMock,
      playerLevel: PlayLevel.beginner,
      user: userCreateMock,
    })
    const res = await POST(req)

    expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    const json = await res.json()
    expect(json.error).toBe("Invalid request body")
    expect(json.details).toBeDefined()
  })

  it("should return 500 for internal server error", async () => {
    cookieStore.set(AUTH_COOKIE_NAME, adminToken)

    const req = createMockNextRequest("", "POST")
    const res = await POST(req)

    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    const json = await res.json()
    expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  })
})
