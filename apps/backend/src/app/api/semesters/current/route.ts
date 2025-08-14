import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { NextResponse } from "next/server"
import { NotFound } from "payload"
import SemesterDataService from "@/data-layer/services/SemesterDataService"

export const GET = async () => {
  const semesterDataService = new SemesterDataService()

  try {
    const currentSemester = await semesterDataService.getCurrentSemester()

    return NextResponse.json({
      data: currentSemester,
    })
  } catch (error) {
    if (error instanceof NotFound) {
      return NextResponse.json(
        { error: "No current semester found" },
        { status: StatusCodes.NOT_FOUND },
      )
    }
    console.error(error)
    return NextResponse.json(
      { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
