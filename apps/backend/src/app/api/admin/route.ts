import { StatusCodes } from "http-status-codes"
import { type NextRequest, NextResponse } from "next/server"

import SemesterService from "@/collections/services/SemesterDataService"
import type { CreateSemesterData } from "@/types/collections"
import { CreateSemesterRequestBody } from "@/types/request-models.ts/SemesterRequests"
import { ZodError } from "zod"

/**
 * POST Method to create a new semester.
 *
 * @param req The request object containing the request body
 * @returns The created semester.
 */
export const POST = async (req: NextRequest) => {
  try {
    const parsedBody = CreateSemesterRequestBody.parse(await req.json())

    const semesterService = new SemesterService()
    const newSemester = await semesterService.createSemester(parsedBody as CreateSemesterData)

    return NextResponse.json(newSemester, { status: StatusCodes.CREATED })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: StatusCodes.BAD_REQUEST },
      )
    }
    console.error(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
