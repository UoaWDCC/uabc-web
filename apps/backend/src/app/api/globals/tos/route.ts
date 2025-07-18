import type { GetTosResponse } from "@repo/shared"
import { NextResponse } from "next/server"
import { payload } from "@/data-layer/adapters/Payload"

export const GET = async (): Promise<NextResponse<GetTosResponse>> => {
  const tos = await payload.findGlobal({
    slug: "termsOfService",
  })

  return NextResponse.json({ data: tos })
}
