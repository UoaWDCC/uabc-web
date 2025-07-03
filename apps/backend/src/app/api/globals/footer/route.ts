import { NextResponse } from "next/server"
import { payload } from "@/data-layer/adapters/Payload"

export const GET = async () => {
  const footer = await payload.findGlobal({
    slug: "footer",
  })

  return NextResponse.json({
    data: footer,
  })
}
