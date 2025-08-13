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
  { req }: { req: PayloadRequest },
): Promise<string | true> => {
  if (!gameSessionSchedules?.length) return "This field is required"

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
  const scheduleName = schedules[0]
  return (
    !schedules.some(
      (schedule) =>
        schedule.name !== scheduleName.name || schedule.location !== scheduleName.location,
    ) || "All game session schedules must have the same title and location."
  )
}
