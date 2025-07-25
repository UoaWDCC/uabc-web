import { UnderConstructionCard } from "@repo/ui/components/Generic"
import { Container, VStack } from "@yamada-ui/react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "Check back later for more information about us!",
}

export default function About() {
  return (
    <VStack as="main">
      <Container centerContent layerStyle="container">
        <UnderConstructionCard />
      </Container>
    </VStack>
  )
}
