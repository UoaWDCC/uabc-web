import type { PayloadRequest } from "payload"
import { gameSessionScheduleCreateMock } from "@/test-config/mocks/GameSessionSchedule.mock"
import { payload } from "../adapters/Payload"
import { validateGameSessionSchedules } from "./location-bubble-validator"

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

    const valid = await validateGameSessionSchedules([newGameSessionSchedule.id], payloadRequest)

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
      payloadRequest,
    )

    expect(valid).toBe(false)
  })
})
