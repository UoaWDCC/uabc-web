"use client"

import { Center, Loading } from "@yamada-ui/react"
import { Suspense } from "react"
import { CallbackSection } from "@/components/client/auth/CallbackSection"

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <Center layerStyle="container">
          <Loading fontSize="5xl" />
        </Center>
      }
    >
      <CallbackSection />
    </Suspense>
  )
}
