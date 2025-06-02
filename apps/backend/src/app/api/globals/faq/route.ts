import { payload } from "@/data-layer/adapters/Payload"
import { NextResponse } from "next/server"

export const GET = async () => {
  const faq = await payload.findGlobal({
    slug: "faq",
  })

  return NextResponse.json({
    data: faq,
  })
}
