import { StatusCodes } from 'http-status-codes'
import { NextRequest, NextResponse } from 'next/server'
import { NotFound } from 'payload'

import SemesterService from '@/collections/services/SemesterService'

/**
 * DELETE method to delete a semester.
 *
 * @param req The request object containing the request body
 * @returns No content status code
 */
export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params
    const semesterService = new SemesterService()
    await semesterService.deleteSemester(id)
    return new NextResponse(null, { status: StatusCodes.NO_CONTENT })
  } catch (error) {
    if (error instanceof NotFound) {
      return NextResponse.json({ error: 'Semester not found' }, { status: StatusCodes.NOT_FOUND })
    } else {
      console.error(error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  }
}
