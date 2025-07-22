import { UnderConstructionCard } from "@repo/ui/components/Generic"
import { Container, VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { AuthWrapper } from "@/components/auth/AuthWrapper"

export const metadata: Metadata = {
  title: "About",
  description: "Check back later for more information about us!",
}

export default function About() {
  return (
    <AuthWrapper scopes={["casual"]}>
      <VStack as="main">
        <Container centerContent layerStyle="container">
          <UnderConstructionCard />
        </Container>
      </VStack>
    </AuthWrapper>
  )
}
