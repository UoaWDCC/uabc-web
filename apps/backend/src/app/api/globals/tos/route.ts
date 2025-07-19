import { NextResponse } from "next/server"
import { payload } from "@/data-layer/adapters/Payload"

export const GET = async () => {
  const tos = await payload.findGlobal({
    slug: "termsOfService",
  })

  return NextResponse.json({ data: tos })
}
