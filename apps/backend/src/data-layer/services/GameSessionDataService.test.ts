import { payload } from "@/data-layer/adapters/Payload"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import GameSessionDataService from "./GameSessionDataService"

const gameSessionDataService = new GameSessionDataService()

describe("GameSessionDataService", () => {
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
        await gameSessionDataService.getPaginatedGameSessionSchedules(2, 5)
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
})
