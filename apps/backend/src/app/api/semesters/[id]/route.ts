import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"
import { NotFound } from "payload"

export const GET = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    const semesterDataService = new SemesterDataService()
    const semester = await semesterDataService.getSemesterById(id)

    return NextResponse.json({
      data: semester,
    })
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
