"use client"
import { UabcHeaderText } from "@/components/Composite/UabcHeaderText"
import { UabcLogo } from "@/components/Composite/UabcLogo"
import { Card, Center, Container, VStack } from "@yamada-ui/react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Center minH="100dvh">
      <Container
        as={Card}
        flexDirection={{ base: "column", lg: "row" }}
        maxW={{
          base: "none",
          sm: "450px",
          lg: "900px",
        }}
      >
        <Center as={VStack}>
          <UabcHeaderText />
          <UabcLogo />
        </Center>

        <Container>{children}</Container>
      </Container>
    </Center>
  )
}
