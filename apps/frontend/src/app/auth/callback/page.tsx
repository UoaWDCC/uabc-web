"use client"

import { Center, Loading } from "@yamada-ui/react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { CallbackSection } from "@/components/client/auth/CallbackSection"

export default function CallbackPage() {
  const searchParams = useSearchParams()
  return (
    <Suspense
      fallback={
        <Center>
          <Loading fontSize="5xl" />
        </Center>
      }
    >
      <CallbackSection searchParams={searchParams} />
    </Suspense>
  )
}
