import { PlayLevel } from "@repo/shared/types"
import { Button } from "@repo/ui/components/Primitive"
import { ButtonGroup, For, Link, Spacer, Text, VStack } from "@yamada-ui/react"
import NextLink from "next/link"

/**
 * A component for choosing a play level when booking a court.
 *
 * @returns A component that displays buttons for different play levels.
 * @example <BookACourt />
 */
export const BookACourt = () => {
  return (
    <VStack alignItems="center" flex={1} gap={{ base: "md", md: "lg" }}>
      <Text color="muted" fontSize={{ base: "lg", md: "xl" }}>
        I am...
      </Text>
      <ButtonGroup
        alignItems="center"
        flexDirection="column"
        gap={{ base: "md", md: "lg" }}
        size="lg"
        w="full"
      >
        <For each={Object.values(PlayLevel)}>
          {(level) => (
            <Button
              as={NextLink}
              colorScheme="primary"
              // TODO: ensure this is the correct path for booking
              href={`/book?playLevel=${level}`}
              key={level}
              maxW="md"
              w="full"
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Button>
          )}
        </For>
      </ButtonGroup>
      <Spacer />
      <Link
        color="muted"
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="medium"
        // TODO: ensure this is the correct path for tos
        href="/terms-of-service"
        textDecoration="underline"
        variant="link"
      >
        Check-In Form Guidelines
      </Link>
    </VStack>
  )
}

BookACourt.displayName = "BookACourt"
