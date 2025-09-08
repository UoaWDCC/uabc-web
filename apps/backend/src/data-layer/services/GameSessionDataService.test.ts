import { TimeframeFilter, Weekday } from "@repo/shared"
import { payload } from "@/data-layer/adapters/Payload"
import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { gameSessionCreateMock } from "@/test-config/mocks/GameSession.mock"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import { semesterCreateMock } from "@/test-config/mocks/Semester.mock"
import { getWeeklySessionDates } from "../utils/DateUtils"
import GameSessionDataService from "./GameSessionDataService"

describe("GameSessionDataService", () => {
  const gameSessionDataService = new GameSessionDataService()
  const semesterDataService = new SemesterDataService()

  describe("createGameSession", () => {
    it("should create a game session document", async () => {
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const fetchedGameSession = await payload.findByID({
        collection: "gameSession",
        id: newGameSession.id,
      })
      expect(fetchedGameSession).toStrictEqual(newGameSession)
    })
  })

  describe("cascadeCreateGameSessions", () => {
    it("should create multiple game session documents excluding mid-semester break", async () => {
      const newSemester = await semesterDataService.createSemester({
        ...semesterCreateMock,
        startDate: new Date(2025, 2, 3, 0, 0).toISOString(), // 3 March 2025
        endDate: new Date(2025, 5, 30, 23, 59).toISOString(), // 30 June 2025
        breakStart: new Date(2025, 3, 14, 0, 0).toISOString(), // 14 April 2025
        breakEnd: new Date(2025, 3, 25, 23, 59).toISOString(), // 25 April 2025
      })

      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule({
        ...gameSessionScheduleCreateMock,
        semester: newSemester.id,
      })

      const gameSessions = await gameSessionDataService.cascadeCreateGameSessions(
        newGameSessionSchedule,
        newSemester,
      )

      const allMondays = getWeeklySessionDates(Weekday.monday, newSemester)
      expect(gameSessions.length).toBe(allMondays.length)

      for (const session of gameSessions) {
        const sessionDate = new Date(session.startTime)
        const breakStart = new Date(newSemester.breakStart)
        const breakEnd = new Date(newSemester.breakEnd)
        expect(sessionDate < breakStart || sessionDate > breakEnd).toBe(true)

        const openDate = new Date(session.openTime)
        const semesterBookingOpenDay = Object.values(Weekday).indexOf(
          newSemester.bookingOpenDay as Weekday,
        )
        const semesterBookingOpenTime = new Date(newSemester.bookingOpenTime)
        expect(openDate <= sessionDate).toBe(true)
        expect(openDate.getUTCDay() === semesterBookingOpenDay).toBe(true)
        expect(openDate.getUTCHours() === semesterBookingOpenTime.getUTCHours()).toBe(true)
        expect(openDate.getUTCMinutes() === semesterBookingOpenTime.getUTCMinutes()).toBe(true)
      }
    })
  })

  describe("getPaginatedGameSessions", () => {
    it("should get all game sessions when not using page and limit", async () => {
      await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const fetchedGameSessions = await gameSessionDataService.getPaginatedGameSessions()
      expect(fetchedGameSessions).not.toBeNull()
      expect(fetchedGameSessions?.totalDocs).toBeGreaterThan(0)

      // check that pagination format is correct
      expect(fetchedGameSessions?.page).toBe(1)
      expect(fetchedGameSessions?.limit).toBe(100)

      expect(fetchedGameSessions?.hasPrevPage).toBe(false)
      expect(fetchedGameSessions?.prevPage).toBe(null)
      expect(fetchedGameSessions?.hasNextPage).toBe(false)
      expect(fetchedGameSessions?.nextPage).toBe(null)
    })

    it("should use pagination to get first page of game sessions when using page and limit", async () => {
      const totalToSeed = 15
      await Promise.all(
        Array.from({ length: totalToSeed }).map(() =>
          gameSessionDataService.createGameSession(gameSessionCreateMock),
        ),
      )

      // test for getting page 2, where each page has a limit of 5 docs
      const fetchedGameSessions = await gameSessionDataService.getPaginatedGameSessions(5, 2)
      expect(fetchedGameSessions).not.toBeNull()

      expect(fetchedGameSessions?.docs).toHaveLength(5)
      expect(fetchedGameSessions?.totalDocs).toBe(15)

      expect(fetchedGameSessions?.page).toBe(2)
      expect(fetchedGameSessions?.limit).toBe(5)
      expect(fetchedGameSessions?.totalPages).toBe(3)

      expect(fetchedGameSessions?.hasPrevPage).toBe(true)
      expect(fetchedGameSessions?.prevPage).toBe(1)
      expect(fetchedGameSessions?.hasNextPage).toBe(true)
      expect(fetchedGameSessions?.nextPage).toBe(3)
    })
  })

  describe("getGameSessionById", () => {
    it("should get a game session by ID", async () => {
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const fetchedGameSession = await gameSessionDataService.getGameSessionById(newGameSession.id)
      expect(fetchedGameSession).toEqual(newGameSession)
    })

    it("should throw a NotFound error if game session does not exist when searching by ID", async () => {
      await expect(
        gameSessionDataService.getGameSessionById("Not a Game Session ID"),
      ).rejects.toThrowError("Not Found")
    })
  })

  describe("updateGameSession", () => {
    it("should update a game session", async () => {
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)
      const updatedData = {
        capacity: 100,
        casualCapacity: 10,
      }

      const updatedGameSession = await gameSessionDataService.updateGameSession(
        newGameSession.id,
        updatedData,
      )
      expect(updatedGameSession).not.toBeNull()
      expect(updatedGameSession?.capacity).toEqual(100)
      expect(updatedGameSession?.casualCapacity).toEqual(10)
    })

    it("should throw a NotFound error if game session does not exist when updating", async () => {
      await expect(
        gameSessionDataService.updateGameSession("Not a Game Session Id", { capacity: 1 }),
      ).rejects.toThrowError("Not Found")
    })
  })

  describe("deleteGameSession", () => {
    it("should delete a game session", async () => {
      const newGameSession = await gameSessionDataService.createGameSession(gameSessionCreateMock)

      const deletedGameSession = await gameSessionDataService.deleteGameSession(newGameSession.id)
      expect(deletedGameSession).not.toBeNull()
      expect(deletedGameSession).toEqual(newGameSession)

      // check that the document is deleted
      await expect(
        gameSessionDataService.getGameSessionById(deletedGameSession.id),
      ).rejects.toThrowError("Not Found")
    })

    it("should throw a NotFound error if game session does not exist when deleting", async () => {
      await expect(
        gameSessionDataService.deleteGameSession("Not a game Session ID"),
      ).rejects.toThrowError("Not Found")
    })
  })

  it("should create a game session schedule document", async () => {
    const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule(
      gameSessionScheduleCreateMock,
    )
    const fetchedGameSessionSchedule = await payload.findByID({
      collection: "gameSessionSchedule",
      id: newGameSessionSchedule.id,
    })
    expect(fetchedGameSessionSchedule).not.toBeNull()
    expect(fetchedGameSessionSchedule.id).toEqual(newGameSessionSchedule.id)
  })

  describe("deleteAllGameSessionsBySemesterId", () => {
    it.skip("should delete all game sessions by semester", async () => {
      const createdSemester = await semesterDataService.createSemester(semesterCreateMock)
      const createdGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule({
        ...gameSessionScheduleCreateMock,
        semester: createdSemester,
      })

      const createdGameSession1 = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        gameSessionSchedule: createdGameSessionSchedule,
      })
      const createdGameSession2 = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        gameSessionSchedule: createdGameSessionSchedule,
      })
      const createdGameSession3 =
        await gameSessionDataService.createGameSession(gameSessionCreateMock)

      const deletedGameSessions = await gameSessionDataService.deleteAllGameSessionsBySemesterId(
        createdSemester.id,
      )
      expect(deletedGameSessions.length).toEqual(2)
      expect(deletedGameSessions).toEqual(
        expect.arrayContaining([createdGameSession1, createdGameSession2]),
      )

      expect(await gameSessionDataService.getGameSessionById(createdGameSession3.id)).toBeDefined()
      await expect(
        gameSessionDataService.getGameSessionById(createdGameSession1.id),
      ).rejects.toThrowError("Not Found")
      await expect(
        gameSessionDataService.getGameSessionById(createdGameSession2.id),
      ).rejects.toThrowError("Not Found")
    })

    it.skip("should return an empty array if no game sessions exist when deleting by a semester ID", async () => {
      expect(
        await gameSessionDataService.deleteAllGameSessionsBySemesterId(
          "Not a valid game session schedule ID",
        ),
      ).toStrictEqual([])
    })
  })

  describe("getGameSessionsBySemesterId", () => {
    it("should return all game sessions for a given semester ID (DEFAULT timeframe)", async () => {
      const { id } = await semesterDataService.createSemester(semesterCreateMock)

      const session1 = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester: id,
      })
      const session2 = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester: id,
      })

      await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester: "123456789065d10f864aeedb",
      })

      const sessions = await gameSessionDataService.getGameSessionsBySemesterId(id)
      expect(sessions).toHaveLength(2)
      expect(sessions).toStrictEqual(expect.arrayContaining([session1, session2]))
    })

    it("should return only UPCOMING game sessions for a given semester ID", async () => {
      const { id } = await semesterDataService.createSemester(semesterCreateMock)
      const now = new Date()

      // UPCOMING: startTime >= now, endTime >= now
      const upcomingSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester: id,
        startTime: new Date(now.getTime() + 1000 * 60 * 60).toISOString(),
        endTime: new Date(now.getTime() + 2000 * 60 * 60).toISOString(),
      })

      // PAST: startTime < now
      await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester: id,
        startTime: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
        endTime: new Date(now.getTime() - 1000 * 60 * 60 * 25).toISOString(),
      })

      // Should only return the upcoming session
      const sessions = await gameSessionDataService.getGameSessionsBySemesterId(
        id,
        TimeframeFilter.UPCOMING,
      )
      expect(sessions).toHaveLength(1)
      expect(sessions[0].id).toBe(upcomingSession.id)
    })

    it("should return only PAST game sessions for a given semester ID", async () => {
      const { id } = await semesterDataService.createSemester(semesterCreateMock)
      const now = new Date()

      // UPCOMING: startTime >= now, endTime >= now
      await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester: id,
        startTime: new Date(now.getTime() + 1000 * 60 * 60).toISOString(), // 1 hour from now
        endTime: new Date(now.getTime() + 1000 * 60 * 60).toISOString(), // 1 hour from now
      })

      // PAST: startTime < now
      const pastSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester: id,
        startTime: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day before now
        endTime: new Date(now.getTime() - 1000 * 60 * 60 * 25).toISOString(), // 25 hours before now
      })

      // Should only return the past session
      const sessions = await gameSessionDataService.getGameSessionsBySemesterId(
        id,
        TimeframeFilter.PAST,
      )
      expect(sessions).toHaveLength(1)
      expect(sessions[0].id).toBe(pastSession.id)
    })

    it("should return only CURRENT game sessions for a given semester ID", async () => {
      const { id } = await semesterDataService.createSemester(semesterCreateMock)
      const now = new Date()

      // CURRENT: endDate >= now && openTime <= now
      const currentSession = await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester: id,
        openTime: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), // 1 hour before now
        endTime: new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString(), // 1 day from now
      })

      // Not CURRENT(PAST): endDate < now
      await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester: id,
        endTime: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        openTime: new Date(now.getTime() + 1000 * 60 * 60).toISOString(), // 1 hour from now
      })

      // Not CURRENT: openTime > now
      await gameSessionDataService.createGameSession({
        ...gameSessionCreateMock,
        semester: id,
        endTime: new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString(), // 1 day from now
        openTime: new Date(now.getTime() + 1000 * 60 * 60).toISOString(), // 1 hour later
      })

      // Should only return the current session
      const sessions = await gameSessionDataService.getGameSessionsBySemesterId(
        id,
        TimeframeFilter.CURRENT,
      )
      expect(sessions).toHaveLength(1)
      expect(sessions[0].id).toBe(currentSession.id)
    })

    it("should return an empty array if no game sessions exist for the semester", async () => {
      const newSemester = await semesterDataService.createSemester(semesterCreateMock)
      const sessions = await gameSessionDataService.getGameSessionsBySemesterId(newSemester.id)
      expect(sessions).toEqual([])
    })
  })

  describe("getPaginatedGameSessionSchedules", () => {
    it("should get all game session schedules when not using page and limit", async () => {
      await gameSessionDataService.createGameSessionSchedule(gameSessionScheduleCreateMock)
      const fetchedGameSessionSchedules =
        await gameSessionDataService.getPaginatedGameSessionSchedules()
      expect(fetchedGameSessionSchedules).not.toBeNull()
      expect(fetchedGameSessionSchedules?.totalDocs).toBeGreaterThan(0)

      // check that pagination format is correct
      expect(fetchedGameSessionSchedules?.page).toBe(1)
      expect(fetchedGameSessionSchedules?.limit).toBe(100)

      expect(fetchedGameSessionSchedules?.hasPrevPage).toBe(false)
      expect(fetchedGameSessionSchedules?.prevPage).toBe(null)
      expect(fetchedGameSessionSchedules?.hasNextPage).toBe(false)
      expect(fetchedGameSessionSchedules?.nextPage).toBe(null)
    })

    it("should use pagination to get first page of game session schedules when using page and limit", async () => {
      const totalToSeed = 15
      await Promise.all(
        Array.from({ length: totalToSeed }).map(() =>
          gameSessionDataService.createGameSessionSchedule(gameSessionScheduleCreateMock),
        ),
      )

      // test for getting page 2, where each page has a limit of 5 docs
      const fetchedGameSessionSchedules =
        await gameSessionDataService.getPaginatedGameSessionSchedules(5, 2)
      expect(fetchedGameSessionSchedules).not.toBeNull()

      expect(fetchedGameSessionSchedules?.docs).toHaveLength(5)
      expect(fetchedGameSessionSchedules?.totalDocs).toBe(15)

      expect(fetchedGameSessionSchedules?.page).toBe(2)
      expect(fetchedGameSessionSchedules?.limit).toBe(5)
      expect(fetchedGameSessionSchedules?.totalPages).toBe(3)

      expect(fetchedGameSessionSchedules?.hasPrevPage).toBe(true)
      expect(fetchedGameSessionSchedules?.prevPage).toBe(1)
      expect(fetchedGameSessionSchedules?.hasNextPage).toBe(true)
      expect(fetchedGameSessionSchedules?.nextPage).toBe(3)
    })
  })

  describe("getGameSessionScheduleById", () => {
    it("should get a game session schedule by ID", async () => {
      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule(
        gameSessionScheduleCreateMock,
      )
      const fetchedGameSessionSchedule = await gameSessionDataService.getGameSessionScheduleById(
        newGameSessionSchedule.id,
      )
      expect(fetchedGameSessionSchedule).toEqual(newGameSessionSchedule)
    })

    it("should throw a NotFound error if game session schedule does not exist when searching by ID", async () => {
      await expect(
        gameSessionDataService.getGameSessionScheduleById("fakeid"),
      ).rejects.toThrowError("Not Found")
    })
  })

  describe("updateGameSessionSchedule", () => {
    it("should update a game session schedule", async () => {
      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule(
        gameSessionScheduleCreateMock,
      )
      const updatedData = {
        capacity: 100,
        casualCapacity: 10,
      }

      const updatedGameSessionSchedule = await gameSessionDataService.updateGameSessionSchedule(
        newGameSessionSchedule.id,
        updatedData,
      )
      expect(updatedGameSessionSchedule).not.toBeNull()
      expect(updatedGameSessionSchedule?.capacity).toEqual(100)
      expect(updatedGameSessionSchedule?.casualCapacity).toEqual(10)
    })

    it("should throw a NotFound error if game session schedule does not exist when updating", async () => {
      await expect(
        gameSessionDataService.updateGameSessionSchedule("fakeid", { capacity: 1 }),
      ).rejects.toThrowError("Not Found")
    })
  })

  describe("deleteGameSessionSchedule", () => {
    it("should delete a game session schedule", async () => {
      const newGameSessionSchedule = await gameSessionDataService.createGameSessionSchedule(
        gameSessionScheduleCreateMock,
      )

      const deletedGameSessionSchedule = await gameSessionDataService.deleteGameSessionSchedule(
        newGameSessionSchedule.id,
      )
      expect(deletedGameSessionSchedule).not.toBeNull()
      expect(deletedGameSessionSchedule).toEqual(newGameSessionSchedule)

      // check that the document is deleted
      await expect(
        gameSessionDataService.getGameSessionScheduleById(deletedGameSessionSchedule.id),
      ).rejects.toThrowError("Not Found")
    })

    it("should throw a NotFound error if game session schedule does not exist when deleting", async () => {
      await expect(gameSessionDataService.deleteGameSessionSchedule("fakeid")).rejects.toThrowError(
        "Not Found",
      )
    })
  })

  describe("deleteAllGameSessionSchedulesBySemesterId", () => {
    it.skip("should delete all game session schedules by a semester ID", async () => {
      const createdSemester = await semesterDataService.createSemester(semesterCreateMock)
      const createdGameSessionSchedule1 = await gameSessionDataService.createGameSessionSchedule({
        ...gameSessionScheduleCreateMock,
        semester: createdSemester.id,
      })
      const createdGameSessionSchedule2 = await gameSessionDataService.createGameSessionSchedule({
        ...gameSessionScheduleCreateMock,
        semester: createdSemester.id,
      })

      const deletedGameSessionSchedules =
        await gameSessionDataService.deleteAllGameSessionSchedulesBySemesterId(createdSemester.id)
      expect(deletedGameSessionSchedules.length).toEqual(2)
      expect(deletedGameSessionSchedules).toEqual(
        expect.arrayContaining([createdGameSessionSchedule1, createdGameSessionSchedule2]),
      )

      await expect(
        gameSessionDataService.getGameSessionScheduleById(createdGameSessionSchedule1.id),
      ).rejects.toThrowError("Not Found")
      await expect(
        gameSessionDataService.getGameSessionScheduleById(createdGameSessionSchedule2.id),
      ).rejects.toThrowError("Not Found")
    })

    it.skip("should return an empty array if no game session schedules exist when searching by a semester ID", async () => {
      expect(
        await gameSessionDataService.deleteAllGameSessionSchedulesBySemesterId(
          "Not a valid semester ID",
        ),
      ).toStrictEqual([])
    })
  })
})
