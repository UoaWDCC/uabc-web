import SemesterDataService from "@/data-layer/services/SemesterDataService"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    const semesterDataService = new SemesterDataService()
    const semesters = await semesterDataService.getAllSemesters()

    return NextResponse.json({
      data: semesters,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
