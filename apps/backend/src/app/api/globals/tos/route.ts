import { TosSchema } from "@repo/shared"
import { StatusCodes } from "http-status-codes"
import { NextResponse } from "next/server"
import { payload } from "@/data-layer/adapters/Payload"

export const GET = async () => {
  const tos = await payload.findGlobal({
    slug: "tos",
  })

  const parseResult = TosSchema.safeParse(tos)

  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid TOS data", issues: parseResult.error.issues },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    )
  }

  return NextResponse.json(
    {
      data: parseResult.data,
    },
    { status: StatusCodes.OK },
  )
}
