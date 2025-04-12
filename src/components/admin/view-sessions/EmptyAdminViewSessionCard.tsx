'use client'

import { isPast } from 'date-fns'
import {
  EmptyState,
  EmptyStateIndicator,
  EmptyStateTitle,
  EmptyStateDescription,
  Button,
  useNotice,
  memo,
  useDisclosure,
} from '@yamada-ui/react'
import { CalendarIcon } from '@yamada-ui/lucide'
import { formatFullDate } from '@/lib/utils/dates'
import { CreateGameSessionFormDialog } from './CreateGameSessionFormDialog'
import { useGameSessionContext } from './GameSessionContext'

export const EmptyAdminViewSessionCard = memo(() => {
  const { open, onOpen, onClose } = useDisclosure()
  const { date, canCreate } = useGameSessionContext()
  const notice = useNotice({ isClosable: true })

  function handleButtonClick() {
    if (!canCreate) {
      notice({
        title: 'No semester found for this date',
        description: 'You can only create game sessions during an active semester.',
        status: 'error',
      })
    } else {
      onOpen()
    }
  }

  return (
    <EmptyState borderWidth="1px" borderColor="border" rounded="md" p="lg">
      <EmptyStateIndicator>
        <CalendarIcon />
      </EmptyStateIndicator>
      <EmptyStateTitle>No sessions found</EmptyStateTitle>
      <EmptyStateDescription>
        No sessions found on {formatFullDate(date).toLocaleString()}
      </EmptyStateDescription>
      <Button
        w="full"
        variant="solid"
        colorScheme="primary"
        onClick={handleButtonClick}
        disabled={isPast(date)}
      >
        Create session
      </Button>
      {canCreate && <CreateGameSessionFormDialog open={open} onClose={onClose} />}
    </EmptyState>
  )
})

EmptyAdminViewSessionCard.displayName = 'EmptyAdminViewSessionCard'
