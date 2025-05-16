import { useQueryClient } from "@tanstack/react-query"
import { getMonth, getYear } from "date-fns"

import { useDeleteGameSessionMutation } from "@/hooks/mutations/game-sessions"
import { QUERY_KEY } from "@/lib/utils/queryKeys"
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, useNotice } from "@yamada-ui/react"
import { type FC, memo } from "react"
import { useGameSessionContext } from "./GameSessionContext"

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
            title: "Success!",
            description: "Game session deleted successfully",
          })
          onClose()
        },
        onError: () => {
          notice({
            title: "Uh oh! Something went wrong",
            description: "An error occurred while updating the game session. Please try again.",
            status: "error",
          })
        },
      })
    }

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogHeader>Delete Game Session?</DialogHeader>
        <DialogBody>Are you sure you want to delete this session?</DialogBody>
        <DialogFooter>
          <Button onClick={onClose} variant="ghost">
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

DeleteGameSessionFormDialog.displayName = "DeleteGameSessionFormDialog"
