import { PlayLevel } from "@repo/shared/types"
import { Button } from "@repo/ui/components/Primitive"
import { ButtonGroup, For, Spacer, Text, VStack } from "@yamada-ui/react"
import Link from "next/link"

export interface BookACourtProps {
  guidelineOnClick: () => void
}

/**
 * A component for choosing a play level when booking a court.
 *
 * @param guidelineOnClick The function to call when the guideline link is clicked.
 * @returns A component that displays buttons for different play levels.
 * @example
 * <BookACourt guidelineOnClick={onOpen} />
 */
export const BookACourt = ({ guidelineOnClick }: BookACourtProps) => {
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
              as={Link}
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
      <Button
        color="muted"
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="medium"
        onClick={guidelineOnClick}
        textDecoration="underline"
        variant="link"
      >
        Check-In Form Guidelines
      </Button>
    </VStack>
  )
}

BookACourt.displayName = "BookACourt"
