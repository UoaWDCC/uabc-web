import { UnderConstructionCard } from "@repo/ui/components/Generic"
import { Container, VStack } from "@yamada-ui/react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events",
  description: "Check back later for upcoming events!",
}

export default function Events() {
  return (
    <VStack as="main">
      <Container centerContent layerStyle="container">
        <UnderConstructionCard />
      </Container>
    </VStack>
  )
}
