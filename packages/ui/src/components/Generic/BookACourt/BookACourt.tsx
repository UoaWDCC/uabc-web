import { PlayLevel } from "@repo/shared"
import { Button, Link } from "@repo/ui/components/Primitive"
import { ButtonGroup, For, Spacer, Text, VStack } from "@yamada-ui/react"
import type { FC } from "react"

/**
 * The props for the BookACourt component.
 */
export type BookACourtProps = {
  /**
   * Callback function triggered when a play level is selected.
   *
   * @param level - The selected play level.
   */
  onSelect: (level: PlayLevel) => void
}

/**
 * A component for choosing a play level when booking a court.
 *
 * @returns A component that displays buttons for different play levels.
 * @example <BookACourt />
 */
export const BookACourt: FC<BookACourtProps> = ({ onSelect }) => {
  return (
    <VStack alignItems="center" flex={1} gap={{ base: "md", md: "lg" }}>
      <Text color="muted" fontSize={{ base: "lg", md: "xl" }}>
        I am...
      </Text>
      <ButtonGroup alignItems="center" flexDirection="column" gap="md" size="lg" w="full">
        <For each={Object.values(PlayLevel)}>
          {(level) => (
            <Button
              colorScheme="primary"
              key={level}
              maxW="md"
              onClick={() => onSelect(level)}
              w="full"
            >
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
      >
        Check-In Form Guidelines
      </Link>
    </VStack>
  )
}

BookACourt.displayName = "BookACourt"
