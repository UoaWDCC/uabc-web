import { NextResponse } from "next/server"
import { payload } from "@/data-layer/adapters/Payload"

export const GET = async () => {
  const aboutUsInfo = await payload.findGlobal({
    slug: "aboutUsInfo",
  })

  return NextResponse.json({
    data: aboutUsInfo,
  })
}
