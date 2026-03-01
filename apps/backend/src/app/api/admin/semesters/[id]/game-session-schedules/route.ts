import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import { Security } from "@/business-layer/middleware/Security"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"

class SemesterGameSessionSchedulesRouteWrapper {
  /**
   * GET method to return all game session schedules for a semester.
   *
   * @param _req The request object
   * @param params The route parameters containing the Semester ID
   * @returns An array of {@link GameSessionSchedule} documents for the semester
   */
  @Security("jwt", ["admin"])
  static async GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      const semesterDataService = new SemesterDataService()
      const gameSessionDataService = new GameSessionDataService()

      await semesterDataService.getSemesterById(id)

      const schedules = await gameSessionDataService.getGameSessionSchedulesBySemesterId(id)
      return NextResponse.json({ data: schedules })
    } catch (error) {
      if (error instanceof NotFound) {
        return NextResponse.json({ error: "Semester not found" }, { status: StatusCodes.NOT_FOUND })
      }
      console.error(error)
      return NextResponse.json(
        { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}

export const { GET } = SemesterGameSessionSchedulesRouteWrapper
