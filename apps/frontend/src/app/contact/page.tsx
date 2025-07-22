import { UnderConstructionCard } from "@repo/ui/components/Generic"
import { Container, VStack } from "@yamada-ui/react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Check back later for our contact information!",
}

export default function Contact() {
  return (
    <VStack as="main">
      <Container centerContent layerStyle="container">
        <UnderConstructionCard />
      </Container>
    </VStack>
  )
}
