import { GridBackground } from "@repo/ui/components/Generic"
import { Heading } from "@repo/ui/components/Primitive"
import { Container, Text, VStack } from "@yamada-ui/react"

export const HeaderSection = () => {
  return (
    <Container
      as="header"
      bgClip="text"
      bgGradient="textGradient"
      centerContent
      layerStyle="container"
    >
      <VStack align="center" gap={{ base: "md", md: "lg" }}>
        <Text fontSize={{ base: "sm", md: "xl" }} textAlign="center">
          UNIVERSITY OF AUCKLAND BADMINTON CLUB
        </Text>
        <Heading.h1 fontSize={{ base: "6xl", md: "8xl" }} fontWeight="bold" textAlign="center">
          <Text>We are UABC.</Text>
          <Text>NZ's Largest Student</Text>
          <Text color="primary">Badminton Club.</Text>
        </Heading.h1>
      </VStack>
      <Text fontSize={{ base: "md", md: "3xl" }} textAlign="center">
        We run weekly badminton sessions and fun social events to connect like-minded badminton
        people! Join our sessions or check our Instagram page for events! 🏸
      </Text>
      <GridBackground />
    </Container>
  )
}
