import { PlayLevel } from "@repo/shared/types"
import { Button } from "@repo/ui/components/Primitive"
import { ButtonGroup, For, Link, Spacer, Text, VStack } from "@yamada-ui/react"
import NextLink from "next/link"
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
        as={NextLink}
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
