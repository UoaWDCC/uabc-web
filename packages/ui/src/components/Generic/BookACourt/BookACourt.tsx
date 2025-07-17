import { PlayLevel } from "@repo/shared/types"
import { Button } from "@repo/ui/components/Primitive"
import { For, Spacer, Text, VStack } from "@yamada-ui/react"

export interface BookACourtProps {
  buttonOnClick: (level: PlayLevel) => void
  guidelineOnClick: () => void
}

/**
 * A component for choosing a play level when booking a court.
 *
 * @param buttonOnClick The function to call when a button is clicked.
 * @param guidelineOnClick The function to call when the guideline link is clicked.
 * @returns A component that displays buttons for different play levels.
 * @example <BookACourt />
 */
export const BookACourt = ({ buttonOnClick, guidelineOnClick }: BookACourtProps) => {
  return (
    <VStack alignItems="center" gap={{ base: "md", md: "lg" }} h="full">
      <Text color="gray.500" fontSize={{ base: "lg", md: "xl" }}>
        I am...
      </Text>
      <For each={Object.values(PlayLevel)}>
        {(level) => (
          <Button
            colorScheme="primary"
            key={level}
            maxW="md"
            onClick={() => buttonOnClick(level)}
            size="lg"
            variant="solid"
            w="full"
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Button>
        )}
      </For>
      <Spacer />
      <Button
        color="gray.500"
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
