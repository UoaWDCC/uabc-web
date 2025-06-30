import { NextResponse } from "next/server"
import { payload } from "@/data-layer/adapters/Payload"

export const GET = async () => {
  const faq = await payload.findGlobal({
    slug: "faq",
  })

  return NextResponse.json({
    data: faq,
  })
}
