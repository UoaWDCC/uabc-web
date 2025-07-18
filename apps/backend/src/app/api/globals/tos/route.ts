import type { GetTosResponse } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { NextResponse } from "next/server"
import { payload } from "@/data-layer/adapters/Payload"

export const GET = async (): Promise<NextResponse<GetTosResponse>> => {
  const tos = await payload.findGlobal({
    slug: "tos",
  })

  return NextResponse.json({ data: tos }, { status: StatusCodes.OK })
}
