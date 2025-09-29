import { NextResponse } from "next/server"
import { payload } from "@/data-layer/adapters/Payload"

export const GET = async () => {
  const onboarding = await payload.findGlobal({
    slug: "onboarding",
  })

  return NextResponse.json({
    data: onboarding,
  })
}
