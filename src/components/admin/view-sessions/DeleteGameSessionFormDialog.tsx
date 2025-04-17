import { useQueryClient } from '@tanstack/react-query'
import { getMonth, getYear } from 'date-fns'

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, useNotice } from '@yamada-ui/react'
import { useDeleteGameSessionMutation } from '@/hooks/mutations/game-sessions'
import { QUERY_KEY } from '@/lib/utils/queryKeys'
import { useGameSessionContext } from './GameSessionContext'
import { type FC, memo } from 'react'

interface DeleteGameSessionFormDialogProps {
  open: boolean
  onClose: () => void
}

export const DeleteGameSessionFormDialog: FC<DeleteGameSessionFormDialogProps> = memo(
  ({ open, onClose }) => {
    const { date } = useGameSessionContext()
    const notice = useNotice()

    const queryClient = useQueryClient()

    const { mutate, isPending } = useDeleteGameSessionMutation()

    const handleSubmit = async () => {
      mutate(date, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.GAME_SESSION, date],
          })
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.ACTIVE_DATES, getYear(date), getMonth(date)],
          })
          notice({
            title: 'Success!',
            description: 'Game session deleted successfully',
          })
          onClose()
        },
        onError: () => {
          notice({
            title: 'Uh oh! Something went wrong',
            description: 'An error occurred while updating the game session. Please try again.',
            status: 'error',
          })
        },
      })
    }

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogHeader>Delete Game Session?</DialogHeader>
        <DialogBody>Are you sure you want to delete this session?</DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" loading={isPending} onClick={handleSubmit}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    )
  },
)

DeleteGameSessionFormDialog.displayName = 'DeleteGameSessionFormDialog'
