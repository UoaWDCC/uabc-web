"use client"

import { formatFullDate } from "@/lib/utils/dates"
import { CalendarIcon } from "@yamada-ui/lucide"
import {
  Button,
  EmptyState,
  EmptyStateDescription,
  EmptyStateIndicator,
  EmptyStateTitle,
  memo,
  useDisclosure,
  useNotice,
} from "@yamada-ui/react"
import { isPast } from "date-fns"
import { CreateGameSessionFormDialog } from "./CreateGameSessionFormDialog"
import { useGameSessionContext } from "./GameSessionContext"

export const EmptyAdminViewSessionCard = memo(() => {
  const { open, onOpen, onClose } = useDisclosure()
  const { date, canCreate } = useGameSessionContext()
  const notice = useNotice({ isClosable: true })

  function handleButtonClick() {
    if (!canCreate) {
      notice({
        title: "No semester found for this date",
        description: "You can only create game sessions during an active semester.",
        status: "error",
      })
    } else {
      onOpen()
    }
  }

  return (
    <EmptyState borderColor="border" borderWidth="1px" p="lg" rounded="md">
      <EmptyStateIndicator>
        <CalendarIcon />
      </EmptyStateIndicator>
      <EmptyStateTitle>No sessions found</EmptyStateTitle>
      <EmptyStateDescription>
        No sessions found on {formatFullDate(date).toLocaleString()}
      </EmptyStateDescription>
      <Button
        colorScheme="primary"
        disabled={isPast(date)}
        onClick={handleButtonClick}
        variant="solid"
        w="full"
      >
        Create session
      </Button>
      {canCreate && <CreateGameSessionFormDialog onClose={onClose} open={open} />}
    </EmptyState>
  )
})

EmptyAdminViewSessionCard.displayName = "EmptyAdminViewSessionCard"
