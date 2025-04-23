import { useQueryClient } from "@tanstack/react-query"
import React, { FC, memo } from "react"

import { useDeleteScheduleMutation } from "@/hooks/mutations/schedules"
import { QUERY_KEY } from "@/lib/utils/queryKeys"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Text,
  useNotice,
} from "@yamada-ui/react"
import { useScheduleContext } from "./SchedulesContext"

interface DeleteScheduleFormDialogProps {
  open: boolean
  onClose: () => void
}

export const DeleteScheduleFormDialog: FC<DeleteScheduleFormDialogProps> = memo(
  ({ open, onClose }) => {
    const { id, weekday, semesterId } = useScheduleContext()
    const notice = useNotice()

    const queryClient = useQueryClient()
    const { mutate, isPending } = useDeleteScheduleMutation()

    const handleDelete = () => {
      mutate(
        { id },
        {
          onError: () => {
            notice({
              title: "Uh oh! Something went wrong",
              description: "An error occurred while deleting the schedule. Please try again.",
              status: "error",
            })
          },
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEY.SCHEDULES, semesterId],
            })
            notice({
              title: "Schedule deleted!",
              description: `${weekday} has been deleted`,
            })
            onClose()
          },
        },
      )
    }

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogHeader>Delete {weekday}&apos;s Schedule?</DialogHeader>
        <DialogBody>
          <Text className="text-tertiary">Are you sure you want to delete this schedule?</Text>
          <Alert
            status="warning"
            flexDir="column"
            alignItems="flex-start"
            variant="subtle"
            colorScheme="danger"
          >
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              By deleting this schedule, all related game sessions will also be deleted. This action
              is irreversible.
            </AlertDescription>
          </Alert>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="danger" loading={isPending} onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    )
  },
)

DeleteScheduleFormDialog.displayName = "DeleteScheduleFormDialog"
