import { UnderConstructionCard } from "@repo/ui/components/Generic"
import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Check back later for our contact information!",
}

export default function Contact() {
  return (
    <VStack alignItems="center" layerStyle="wrapper">
      <UnderConstructionCard />
    </VStack>
  )
}
