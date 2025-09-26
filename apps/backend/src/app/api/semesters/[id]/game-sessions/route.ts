import { SearchParams, TimeframeFilter } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"
import GameSessionDataService from "@/data-layer/services/GameSessionDataService"
import SemesterDataService from "@/data-layer/services/SemesterDataService"

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const searchParams = req.nextUrl.searchParams
  const timeframe = (searchParams.get(SearchParams.SESSION_TIMEFRAME) ||
    TimeframeFilter.DEFAULT) as TimeframeFilter

  try {
    const semesterDataService = new SemesterDataService()
    const gameSessionDataService = new GameSessionDataService()

    const semester = await semesterDataService.getSemesterById(id)
    const sessions = await gameSessionDataService.getGameSessionsBySemesterId(
      semester.id,
      timeframe,
    )

    return NextResponse.json({ data: sessions })
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
