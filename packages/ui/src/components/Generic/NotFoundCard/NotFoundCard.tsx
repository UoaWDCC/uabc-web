import { Button, Heading } from "@repo/ui/components/Primitive"
import { Center, Text, VStack } from "@yamada-ui/react"
import Link from "next/link"

/**
 * A 404 Not Found component for when a page is not found.
 *
 * @returns A 404 Not Found component with a message and a button to return home.
 */
export const NotFoundCard = () => {
  return (
    <Center h="full" py="2xl" w="full">
      <VStack
        align="center"
        bgColor="secondary"
        borderRadius="2xl"
        boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
        gap="xl"
        layerStyle="gradientBorder"
        py={{ base: "lg", md: "4xl" }}
        w={{ base: "full", md: "2xl" }}
      >
        <VStack gap="md" textAlign="center">
          <Heading.h1 fontSize={{ base: "3xl", md: "5xl" }}>Error 404</Heading.h1>
          <Text>Page Not Found</Text>
        </VStack>
        <Button as={Link} colorScheme="primary" href="/" size="lg">
          Return Home
        </Button>
      </VStack>
    </Center>
  )
}
