import { gameSessionMock } from "@repo/shared/mocks"
import { mapGameSessionsToSessionItems } from "./GameSessionAdapter"

describe("mapGameSessionsToSessionItems", () => {
  it("maps game sessions to session items", () => {
    const session = {
      ...gameSessionMock,
      name: "UoA Rec Centre",
      location: "17 Symonds Street",
      startTime: new Date(Date.now() + 60_000).toISOString(), // 1 minute in future
      endTime: new Date(Date.now() + 120_000).toISOString(), // 2 minutes in future
      openTime: new Date(Date.now() - 60_000).toISOString(), // 1 minute in past
      capacity: 10,
      casualCapacity: 5,
    }
    const result = mapGameSessionsToSessionItems([session])
    expect(result).toHaveLength(1)
    const item = result[0]
    expect(item.id).toBe(session.id)
    expect(item.name).toBe(session.name ?? undefined)
    expect(item.location).toBe(session.location ?? undefined)
    const expectedStart = new Date(session.startTime).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    const expectedEnd = new Date(session.endTime).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    expect(item.startTime).toBe(expectedStart)
    expect(item.endTime).toBe(expectedEnd)
    expect(item.capacity).toBe(session.capacity)
    expect(item.casualCapacity).toBe(session.casualCapacity)
    expect(item.attendees).toBe(0)
    expect(item.casualAttendees).toBe(0)
    expect(item.date).toBe(session.startTime)
    expect(item.disabled).toBe(false)
  })

  it("sets undefined for nullable fields", () => {
    const session = {
      ...gameSessionMock,
      name: null,
      location: null,
      startTime: new Date(Date.now() + 60_000).toISOString(), // 1 minute in future
      endTime: new Date(Date.now() + 120_000).toISOString(), // 2 minutes in future
      openTime: new Date(Date.now() - 60_000).toISOString(), // 1 minute in past
    }
    const [item] = mapGameSessionsToSessionItems([session])
    expect(item.name).toBeUndefined()
    expect(item.location).toBeUndefined()
  })
})
