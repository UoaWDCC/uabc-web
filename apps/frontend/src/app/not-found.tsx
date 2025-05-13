import { UabcHeaderText } from "@/components/Composite/UabcHeaderText"
import { UabcLogoNotFound } from "@/components/Composite/UabcLogoNotFound"
import { Button } from "@repo/ui/components/Button"
import { Heading } from "@repo/ui/components/Heading"
import { Center, Container, Text, VStack } from "@yamada-ui/react"
import Link from "next/link"

export const metadata = {
  title: "Not Found - UABC Booking Portal",
}

const NotFoundPage = () => {
  return (
    <Container centerContent height={"100dvh"} justifyContent={"space-evenly"}>
      <UabcHeaderText />
      <VStack alignItems={"center"} width={"fit-content"}>
        <Center height={"72"} marginBottom={"4"} opacity={"70"} width={"72"}>
          <UabcLogoNotFound
            color={"transparentize(var(--color-foreground), 70%)"}
            position={"absolute"}
            userSelect={"none"}
          />
          <Heading.h1 fontSize={"7xl"} userSelect={"none"}>
            404
          </Heading.h1>
        </Center>
        <Text
          color={"transparentize(var(--color-foreground), 70%)"}
          fontSize={"2xl"}
          fontWeight={"medium"}
          textAlign={"center"}
        >
          Page not found
        </Text>
      </VStack>
      <Button as={Link} href="/" w="fit-content">
        Back to home
      </Button>
    </Container>
  )
}

export default NotFoundPage
