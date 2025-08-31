import { eventCreateMock } from "@/test-config/mocks/Event.mock"
import { payload } from "../adapters/Payload"
import EventDataService from "./EventDataService"

describe("EventDataService", () => {
  const eventDataService = new EventDataService()

  describe("getEventById", () => {
    it("should get a event by ID", async () => {
      const newEvent = await payload.create({
        collection: "event",
        data: eventCreateMock,
      })
      const fetchedEvent = await eventDataService.getEventById(newEvent.id)
      expect(newEvent).toEqual(fetchedEvent)
    })

    it("should throw a NotFound error when a event is not found by ID", async () => {
      const fetchedEvent = eventDataService.getEventById("nonexistentid")
      await expect(fetchedEvent).rejects.toThrow("Not Found")
    })
  })

  describe("getAllEvents", () => {
    it("should get all events", async () => {
      const newEvent1 = await payload.create({
        collection: "event",
        data: eventCreateMock,
      })
      const newEvent2 = await payload.create({
        collection: "event",
        data: eventCreateMock,
      })
      const fetchedEvents = await eventDataService.getAllEvents()
      expect(fetchedEvents.length).toStrictEqual(2)
      expect(fetchedEvents).toStrictEqual(expect.arrayContaining([newEvent1, newEvent2]))
    })

    it("should return an empty array when no events", async () => {
      expect(await eventDataService.getAllEvents()).toStrictEqual([])
    })
  })
})
