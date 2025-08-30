import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { payload } from "@/data-layer/adapters/Payload"
import EventDataService from "@/data-layer/services/EventDataService"
import { eventCreateMock } from "@/test-config/mocks/Event.mock"
import { GET } from "./route"

describe("/api/events", () => {
  describe("GET", () => {
    it("should return all events", async () => {
      const newEvent1 = await payload.create({
        collection: "event",
        data: eventCreateMock,
      })
      const newEvent2 = await payload.create({
        collection: "event",
        data: eventCreateMock,
      })
      const response = await GET()

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
      expect(json.data).toHaveLength(2)
      expect(json.data).toEqual(expect.arrayContaining([newEvent1, newEvent2]))
    })

    it("should return empty array when no events exist", async () => {
      const response = await GET()

      expect(response.status).toBe(StatusCodes.OK)
      const json = await response.json()
      expect(json.data).toHaveLength(0)
    })

    it("should handle errors and return 500 status", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      const mockGetAllSemesters = vi
        .spyOn(EventDataService.prototype, "getAllEvents")
        .mockRejectedValueOnce(new Error("Database error"))

      const response = await GET()

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      const json = await response.json()
      expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      expect(mockGetAllSemesters).toHaveBeenCalledWith()
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })
})
