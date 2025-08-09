import { NextResponse } from "next/server"
import { payload } from "@/data-layer/adapters/Payload"

export const GET = async () => {
  const locationBubble = await payload.findGlobal({
    slug: "locationBubble",
  })

  return NextResponse.json({
    data: locationBubble,
  })
}
