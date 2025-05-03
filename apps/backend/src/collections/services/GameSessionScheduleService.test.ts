import { clearCollection, testPayloadObject } from "@/test-config/backend-utils"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import dotenv from "dotenv"
import GameSessionScheduleService from "./GameSessionScheduleService"

dotenv.config()

const gameSessionScheduleService = new GameSessionScheduleService()

describe("game session schedule service", () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, "gameSessionSchedule")
  })

  it("should create a game session schedule document", async () => {
    const newGameSessionSchedule = await gameSessionScheduleService.createGameSessionSchedule(
      gameSessionScheduleCreateMock,
    )
    const fetchedGameSessionSchedule = await testPayloadObject.find({
      collection: "gameSessionSchedule",
      where: {
        id: {
          equals: newGameSessionSchedule.id,
        },
      },
    })
    expect(fetchedGameSessionSchedule.docs[0]).toEqual(newGameSessionSchedule)
  })

  describe("getGameSessionSchedules", () => {
    it("should get all game session schedules when not using page and limit", async () => {
      await gameSessionScheduleService.createGameSessionSchedule(gameSessionScheduleCreateMock)
      const fetchedGameSessionSchedules = await gameSessionScheduleService.getGameSessionSchedules()
      expect(fetchedGameSessionSchedules).not.toBeNull()
      expect(fetchedGameSessionSchedules?.totalDocs).toBeGreaterThan(0)

      // check that pagination format is correct
      expect(fetchedGameSessionSchedules?.page).toBe(1)
      expect(fetchedGameSessionSchedules?.limit).toBe(10)

      expect(fetchedGameSessionSchedules?.hasPrevPage).toBe(false)
      expect(fetchedGameSessionSchedules?.prevPage).toBe(null)
      expect(fetchedGameSessionSchedules?.hasNextPage).toBe(false)
      expect(fetchedGameSessionSchedules?.nextPage).toBe(null)
    })

    it("should use pagination to get first page of game session schedules when using page and limit", async () => {
      const totalToSeed = 15
      await Promise.all(
        Array.from({ length: totalToSeed }).map(() =>
          gameSessionScheduleService.createGameSessionSchedule(gameSessionScheduleCreateMock),
        ),
      )

      const pageToFetch = 2
      const limit = 5

      const expectedPages = Math.ceil(totalToSeed / limit)
      const expectedFetchedLength =
        expectedPages === pageToFetch ? (totalToSeed % limit) + 1 : limit
      const hasPrevPage = pageToFetch > 1
      const hasNextPage = pageToFetch < expectedPages

      const fetchedGameSessionSchedules = await gameSessionScheduleService.getGameSessionSchedules({
        page: pageToFetch,
        limit: limit,
      })
      expect(fetchedGameSessionSchedules).not.toBeNull()

      expect(fetchedGameSessionSchedules?.docs).toHaveLength(expectedFetchedLength)
      expect(fetchedGameSessionSchedules?.totalDocs).toBe(totalToSeed)

      expect(fetchedGameSessionSchedules?.page).toBe(pageToFetch)
      expect(fetchedGameSessionSchedules?.limit).toBe(limit)
      expect(fetchedGameSessionSchedules?.totalPages).toBe(expectedPages)

      expect(fetchedGameSessionSchedules?.hasPrevPage).toBe(hasPrevPage)
      expect(fetchedGameSessionSchedules?.prevPage).toBe(hasPrevPage ? pageToFetch - 1 : null)
      expect(fetchedGameSessionSchedules?.hasNextPage).toBe(hasNextPage)
      expect(fetchedGameSessionSchedules?.nextPage).toBe(hasNextPage ? pageToFetch + 1 : null)
    })
  })

  describe("getGameSessionScheduleById", () => {
    it("should get a game session schedule by ID", async () => {
      const newGameSessionSchedule = await gameSessionScheduleService.createGameSessionSchedule(
        gameSessionScheduleCreateMock,
      )
      const fetchedGameSessionSchedule =
        await gameSessionScheduleService.getGameSessionScheduleById(newGameSessionSchedule.id)
      expect(fetchedGameSessionSchedule).toEqual(newGameSessionSchedule)
    })

    it("should return null if game session schedule does not exist when searching by ID", async () => {
      await expect(
        gameSessionScheduleService.getGameSessionScheduleById("fakeid"),
      ).rejects.toThrowError("Not Found")
    })
  })

  describe("updateGameSessionSchedule", () => {
    it("should update a game session schedule", async () => {
      const newGameSessionSchedule = await gameSessionScheduleService.createGameSessionSchedule(
        gameSessionScheduleCreateMock,
      )
      const updatedData = {
        capacity: 100,
        casualCapacity: 10,
      }

      const updatedGameSessionSchedule = await gameSessionScheduleService.updateGameSessionSchedule(
        newGameSessionSchedule.id,
        updatedData,
      )
      expect(updatedGameSessionSchedule).not.toBeNull()
      expect(updatedGameSessionSchedule?.capacity).toEqual(100)
      expect(updatedGameSessionSchedule?.casualCapacity).toEqual(10)
    })

    it("should return null if game session schedule does not exist when updating", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      const updatedData = {
        capacity: 100,
        casualCapacity: 10,
      }

      const updatedGameSessionSchedule = await gameSessionScheduleService.updateGameSessionSchedule(
        "fakeid",
        updatedData,
      )
      expect(updatedGameSessionSchedule).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error updating game session schedule with ID fakeid:",
        "Not Found",
      )
      consoleErrorSpy.mockRestore()
    })
  })

  describe("deleteGameSessionSchedule", () => {
    it("should delete a game session schedule", async () => {
      const newGameSessionSchedule = await gameSessionScheduleService.createGameSessionSchedule(
        gameSessionScheduleCreateMock,
      )

      const deletedGameSessionSchedule = await gameSessionScheduleService.deleteGameSessionSchedule(
        newGameSessionSchedule.id,
      )
      expect(deletedGameSessionSchedule).not.toBeNull()
      expect(deletedGameSessionSchedule).toEqual(newGameSessionSchedule)
    })

    it("should return null if game session schedule does not exist when deleting", async () => {
      await expect(
        gameSessionScheduleService.deleteGameSessionSchedule("fakeid"),
      ).rejects.toThrowError("Not Found")
    })
  })
})
