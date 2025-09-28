import {
  AUTH_COOKIE_NAME,
  type CreateBookingRequest,
  type CreateSemesterData,
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
import MailService from "@/business-layer/services/MailService"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { POST } from "./route"

describe("/api/bookings", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()
  const semesterDataService = new SemesterDataService()
  const gameSessionDataService = new GameSessionDataService()
  const userDataService = new UserDataService()

  describe("POST", () => {
    const now = new Date()

    const currentSemesterCreateMock: CreateSemesterData = {
      ...semesterCreateMock,
      startDate: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)).toISOString(),
      endDate: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 4, 0)).toISOString(),
    }

    it("should return a 401 if token is missing", async () => {
      const res = await POST(createMockNextRequest())
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No token provided" })
    })

    it("should return a 201 if the booking is valid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const semester = await semesterDataService.createSemester(currentSemesterCreateMock)
      const gameSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester,
      })
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

    it("should return a 403 if a member has reached their max number of bookings per week", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)

      const currentSemester = await semesterDataService.createSemester(currentSemesterCreateMock)

      const startTime = new Date(now)
      startTime.setUTCMinutes(now.getUTCMinutes() + 1)
      const endTime = new Date(startTime)
      endTime.setUTCMinutes(now.getUTCMinutes() + 59)

      const futureGameSessionCreateMock = {
        ...gameSessionCreateMock,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        semester: currentSemester,
      }

      const gameSession = await gameSessionDataService.createGameSession(
        futureGameSessionCreateMock,
      )
      const gameSession2 = await gameSessionDataService.createGameSession(
        futureGameSessionCreateMock,
      )
      const gameSession3 = await gameSessionDataService.createGameSession(
        futureGameSessionCreateMock,
      )

      await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: gameSession.id,
        user: memberUserMock,
      })
      await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: gameSession2.id,
        user: memberUserMock,
      })

      const req = createMockNextRequest("/api/bookings", "POST", {
        gameSession: gameSession3,
        playerLevel: PlayLevel.beginner,
      } satisfies CreateBookingRequest)

      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.FORBIDDEN)
      expect(await res.json()).toStrictEqual({ error: "Weekly booking limit reached" })
    })

    it("should return a 403 if a member has reached their max number of bookings per week", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)

      const currentSemester = await semesterDataService.createSemester(currentSemesterCreateMock)

      const startTime = new Date(now)
      startTime.setUTCMinutes(now.getUTCMinutes() + 1)
      const endTime = new Date(startTime)
      endTime.setUTCMinutes(now.getUTCMinutes() + 59)

      const futureGameSessionCreateMock = {
        ...gameSessionCreateMock,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        semester: currentSemester,
      }

      const gameSession = await gameSessionDataService.createGameSession(
        futureGameSessionCreateMock,
      )
      const gameSession2 = await gameSessionDataService.createGameSession(
        futureGameSessionCreateMock,
      )

      await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: gameSession.id,
        user: casualUserMock,
      })

      const req = createMockNextRequest("/api/bookings", "POST", {
        gameSession: gameSession2,
        playerLevel: PlayLevel.beginner,
      } satisfies CreateBookingRequest)

      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.FORBIDDEN)
      expect(await res.json()).toStrictEqual({ error: "Weekly booking limit reached" })
    })

    it("should call the booking confirmation email service", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const sendBookingConfirmationSpy = vi
        .spyOn(MailService, "sendBookingConfirmation")
        .mockResolvedValueOnce({ success: true })

      const req = createMockNextRequest("/api/bookings", "POST", {
        gameSession,
        playerLevel: PlayLevel.beginner,
      } satisfies CreateBookingRequest)
      const res = await POST(req)

      expect(res.status).toBe(StatusCodes.CREATED)
      expect(sendBookingConfirmationSpy).toHaveBeenCalledTimes(1)
      expect(sendBookingConfirmationSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          user: expect.objectContaining({
            id: casualUserMock.id,
            email: casualUserMock.email,
          }),
          gameSession: expect.objectContaining({
            id: gameSession.id,
          }),
        }),
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
