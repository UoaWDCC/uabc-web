import {
  AUTH_COOKIE_NAME,
  type CreateBookingRequestBodyType,
  JWTEncryptedUserSchema,
  MembershipType,
  PlayLevel,
} from "@repo/shared"
import { userCreateMock } from "@repo/shared/mocks"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { cookies } from "next/headers"
import AuthService from "@/business-layer/services/AuthService"
import BookingDataService from "@/data-layer/services/BookingDataService"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { adminToken, casualToken, memberToken } from "@/test-config/vitest.setup"
import { POST } from "./route"

describe("/api/bookings", async () => {
  const cookieStore = await cookies()
  const bookingDataService = new BookingDataService()
  const gameSessionDataService = new GameSessionDataService()
  const userDataService = new UserDataService()
  const authService = new AuthService()

  describe("POST", () => {
    it("should return a 401 if token is missing", async () => {
      const req = createMockNextRequest("/api/bookings", "POST")
      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
      expect(await res.json()).toStrictEqual({ error: "No token provided" })
    })

    it("should return a 200 if the booking is valid", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, memberToken)
      const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const tokenData = authService.getData(memberToken, JWTEncryptedUserSchema)
      expect(tokenData).toBeDefined()

      const remainingSessions = tokenData?.user.remainingSessions ?? 0
      const newRemainingSessions = remainingSessions - 1

      const req = createMockNextRequest("/api/bookings", "POST", {
        gameSession,
        playerLevel: PlayLevel.beginner,
      } satisfies CreateBookingRequestBodyType)

      const res = await POST(req)
      expect(res.status).toBe(StatusCodes.CREATED)
      const data = (await res.json()).data
      expect(data.id).toBeDefined()
      expect(await bookingDataService.getBookingById(data.id)).toBeDefined()

      if (tokenData) {
        const user = await userDataService.getUserById(tokenData.user.id)
        expect(user.remainingSessions).toBe(newRemainingSessions)

        if (newRemainingSessions <= 0) {
          expect(user.role).toBe(MembershipType.casual)
        }
      }
    })

    it("should return a 409 if the user has already made a booking for the session", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      await bookingDataService.createBooking({
        ...bookingCreateMock,
        gameSession: gameSession.id,
      })

      const req = createMockNextRequest("/api/bookings", "POST", {
        gameSession,
        playerLevel: PlayLevel.beginner,
      } satisfies CreateBookingRequestBodyType)
      const res = await POST(req)

      expect(res.status).toBe(StatusCodes.CONFLICT)
      expect(await res.json()).toStrictEqual({ error: "Session already booked" })
    })

    it("should return a 403 if the user has no remaining sessions", async () => {
      cookieStore.set(AUTH_COOKIE_NAME, casualToken)
      const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const tokenData = authService.getData(casualToken, JWTEncryptedUserSchema)
      expect(tokenData).toBeDefined()

      const req = createMockNextRequest("/api/bookings", "POST", {
        gameSession,
        playerLevel: PlayLevel.beginner,
      } satisfies CreateBookingRequestBodyType)

      if (tokenData) {
        await userDataService.updateUser(tokenData.user.id, {
          remainingSessions: 0,
        })
      }

      const res = await POST(req)

      expect(res.status).toBe(StatusCodes.FORBIDDEN)
      expect(await res.json()).toStrictEqual({ error: "No remaining sessions" })
    })
  })

  it("should a 403 if the user is a casual and has exceeded booking capacity", async () => {
    cookieStore.set(AUTH_COOKIE_NAME, casualToken)
    const gameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
    await bookingDataService.createBooking({
      ...bookingCreateMock,
      gameSession: gameSession.id,
    })

    const req = createMockNextRequest("/api/bookings", "POST", {
      gameSession: {
        ...gameSession,
        casualCapacity: 1,
      },
      playerLevel: PlayLevel.beginner,
    } satisfies CreateBookingRequestBodyType)
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

    const req = createMockNextRequest("/api/bookings", "POST", {
      gameSession: {
        ...gameSession,
        capacity: 1,
      },
      playerLevel: PlayLevel.beginner,
    } satisfies CreateBookingRequestBodyType)
    const res = await POST(req)

    expect(res.status).toBe(StatusCodes.FORBIDDEN)
    expect(await res.json()).toStrictEqual({
      error: "Session is full for the selected user role",
    })
  })

  it("should return 400 if request body is invalid", async () => {
    cookieStore.set(AUTH_COOKIE_NAME, adminToken)
    const req = createMockNextRequest("/api/bookings", "POST", {
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
    const req = createMockNextRequest("/api/bookings", "POST")
    const res = await POST(req)
    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)

    const json = await res.json()
    expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  })
})
