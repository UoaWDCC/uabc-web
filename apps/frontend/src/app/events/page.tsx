import { UnderConstructionCard } from "@repo/ui/components/Generic"
import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events",
  description: "Check back later for upcoming events!",
}

export default function Events() {
  return (
    <VStack alignItems="center" layerStyle="wrapper">
      <UnderConstructionCard />
    </VStack>
  )
}
