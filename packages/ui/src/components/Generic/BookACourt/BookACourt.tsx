import { PlayLevel } from "@repo/shared/types"
import { Button } from "@repo/ui/components/Primitive"
import { For, Text, VStack } from "@yamada-ui/react"

export interface BookACourtProps {
  onClick: (level: PlayLevel) => void
}

/**
 * A component for choosing a play level when booking a court.
 *
 * @param onClick The function to call when a button is clicked.
 * @returns A component that displays buttons for different play levels.
 * @example <BookACourt />
 */
export const BookACourt = ({ onClick }: BookACourtProps) => {
  return (
    <VStack alignItems="center" gap={{ base: "sm", md: "lg" }}>
      <Text color="gray.500" fontSize={{ base: "lg", md: "xl" }}>
        I am...
      </Text>
      <For each={Object.values(PlayLevel)}>
        {(level) => (
          <Button
            colorScheme="primary"
            key={level}
            maxW="md"
            onClick={() => onClick(level)}
            size="lg"
            variant="solid"
            w="full"
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Button>
        )}
      </For>
    </VStack>
  )
}

BookACourt.displayName = "BookACourt"
