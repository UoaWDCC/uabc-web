import { getReasonPhrase, StatusCodes } from "http-status-codes"
import { NextResponse } from "next/server"
import EventDataService from "@/data-layer/services/EventDataService"

export const GET = async () => {
  const eventDataService = new EventDataService()

  try {
    const events = await eventDataService.getAllEvents()

    return NextResponse.json({
      data: events,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }
}
