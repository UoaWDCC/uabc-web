import { payload } from "@/data-layer/adapters/Payload"
import { NextResponse } from "next/server"

export const GET = async () => {
  const navbar = await payload.findGlobal({
    slug: "navbar",
  })

  return NextResponse.json({
    data: navbar,
  })
}
