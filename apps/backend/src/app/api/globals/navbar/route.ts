import { NextResponse } from "next/server"
import { payload } from "@/data-layer/adapters/Payload"

export const GET = async () => {
  const navbar = await payload.findGlobal({
    slug: "navbar",
  })

  return NextResponse.json({
    data: navbar,
  })
}
