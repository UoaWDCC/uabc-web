import { payload } from "@/data-layer/adapters/Payload"
import { NextResponse } from "next/server"

export const GET = async () => {
  const footer = await payload.findGlobal({
    slug: "footer",
  })

  return NextResponse.json({
    data: footer,
  })
}
