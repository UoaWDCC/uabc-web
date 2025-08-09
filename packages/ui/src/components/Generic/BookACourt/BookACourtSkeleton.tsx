import { PlayLevel } from "@repo/shared"
import { Button, Link } from "@repo/ui/components/Primitive"
import { ButtonGroup, For, Spacer, Text, VStack } from "@yamada-ui/react"

/**
 * A component for choosing a play level when booking a court.
 *
 * @returns A component that displays buttons for different play levels.
 * @example <BookACourt />
 */
export const BookACourtSkeleton = () => {
  return (
    <VStack alignItems="center" flex={1} gap={{ base: "md", md: "lg" }}>
      <Text color="muted" fontSize={{ base: "lg", md: "xl" }}>
        I am...
      </Text>
      <ButtonGroup alignItems="center" flexDirection="column" gap="md" size="lg" w="full">
        <For each={Object.values(PlayLevel)}>
          {(level) => (
            <Button colorScheme="primary" disabled key={level} maxW="md" w="full">
              {level}
            </Button>
          )}
        </For>
      </ButtonGroup>
      <Spacer />
      <Link
        color="muted"
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="medium"
        href="/terms"
        textDecoration="underline"
        variant="link"
      >
        Check-In Form Guidelines
      </Link>
    </VStack>
  )
}
