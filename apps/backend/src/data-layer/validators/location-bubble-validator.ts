import type { RelationshipValueMany } from "node_modules/payload/dist/fields/config/types"
import type { PayloadRequest } from "payload"

/**
 * Validates if game session schedule in an array have all the same location and name
 *
 * @param gameSessionSchedules An array of {@link gameSessionSchedule} document IDs
 * @param req The payload request object
 * @returns boolean
 */
export const validateGameSessionSchedules = async (
  gameSessionSchedules: RelationshipValueMany | null | undefined,
  req: PayloadRequest,
) => {
  if (!gameSessionSchedules || gameSessionSchedules.length === 0) return true

  const gameSessionScheduleIds = Array.isArray(gameSessionSchedules)
    ? gameSessionSchedules
    : [gameSessionSchedules]

  const schedules = await Promise.all(
    gameSessionScheduleIds.map((id) =>
      req.payload.findByID({
        collection: "gameSessionSchedule",
        id: String(id),
      }),
    ),
  )
  const first = schedules[0]
  const differentGameSessionSchedules = schedules.some(
    (schedule) => schedule.name !== first.name || schedule.location !== first.location,
  )
  if (differentGameSessionSchedules) {
    return false
  }
  return true
}
