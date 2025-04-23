import { useMutation, useQueryClient } from "@tanstack/react-query"

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
import { useSemesterContext } from "./SemestersContext"

interface DeleteSemesterFormDialogProps {
  open: boolean
  onClose: () => void
}

export const DeleteSemesterFormDialog = ({ open, onClose }: DeleteSemesterFormDialogProps) => {
  const { name, id: semesterId } = useSemesterContext()
  const notice = useNotice()

  // React-query
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/semesters/${semesterId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        await response.text().then((text) => {
          throw new Error(text || "An error has occurred")
        })
      }
      return response
    },
  })

  const handleDelete = () => {
    mutation.mutate(undefined, {
      onError: () => {
        notice({
          title: "Uh oh! Something went wrong",
          description: "An error occurred while deleting the semester. Please try again.",
          status: "error",
        })
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SEMESTERS] })
        notice({
          title: "Semester deleted!",
          description: `${name} has been deleted`,
          status: "success",
        })
        onClose()
      },
    })
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>Delete {name}?</DialogHeader>
      <DialogBody>
        <Text className="text-tertiary">Are you sure you want to delete this semester?</Text>
        <Alert
          status="warning"
          flexDir="column"
          alignItems="flex-start"
          variant="subtle"
          colorScheme="danger"
        >
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            By deleting this semester, all related game session schedules to it will also be
            deleted. This action is irreversible.
          </AlertDescription>
        </Alert>
      </DialogBody>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button colorScheme="danger" loading={mutation.isPending} onClick={handleDelete}>
          Delete
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
