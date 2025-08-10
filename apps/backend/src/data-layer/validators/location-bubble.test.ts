import type { PayloadRequest } from "payload"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import { payload } from "../adapters/Payload"
import { validateGameSessionSchedules } from "./location-bubble"

describe("validateGameSessionSchedules", () => {
  const payloadRequest = {
    payload,
    user: null,
    payloadAPI: "local",
  } as PayloadRequest

  it("returns true if same game session schedules location and name", async () => {
    const newGameSessionSchedule = await payload.create({
      collection: "gameSessionSchedule",
      data: gameSessionScheduleCreateMock,
    })

    const valid = await validateGameSessionSchedules([newGameSessionSchedule.id], {
      req: payloadRequest,
    })

    expect(valid).toBe(true)
  })

  it("returns false if same different game session schedules location or name", async () => {
    const newGameSessionSchedule1 = await payload.create({
      collection: "gameSessionSchedule",
      data: gameSessionScheduleCreateMock,
    })

    const newGameSessionSchedule2 = await payload.create({
      collection: "gameSessionSchedule",
      data: { ...gameSessionScheduleCreateMock, location: "invalid" },
    })

    const valid = await validateGameSessionSchedules(
      [newGameSessionSchedule1.id, newGameSessionSchedule2.id],
      { req: payloadRequest },
    )

    expect(valid).toBe("All game session schedules must have the same title and location.")
  })

  it("returns false if no game session schedule selected", async () => {
    const valid = await validateGameSessionSchedules([], {
      req: payloadRequest,
    })

    expect(valid).toBe("This field is required")
  })
})
