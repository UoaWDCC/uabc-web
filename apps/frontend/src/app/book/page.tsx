import { UnderConstructionCard } from "@repo/ui/components/Generic"
import { Container, VStack } from "@yamada-ui/react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book",
  description: "Check back later for booking functionality!",
}

export default function Book() {
  return (
    <VStack as="main">
      <Container centerContent layerStyle="container">
        <UnderConstructionCard />
      </Container>
    </VStack>
  )
}
