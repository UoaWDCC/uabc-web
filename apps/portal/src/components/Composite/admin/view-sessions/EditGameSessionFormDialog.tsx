import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { format, parse } from "date-fns"
import { type FC, memo } from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { useEditGameSessionMutation } from "@/hooks/mutations/game-sessions"
import { formatFullDate } from "@/lib/utils/dates"
import { QUERY_KEY } from "@/lib/utils/queryKeys"
import { InputType, TextInput } from "@repo/ui/components/TextInput"
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  HStack,
  useNotice,
} from "@yamada-ui/react"
import { useGameSessionContext } from "./GameSessionContext"
import { gameSessionFormSchema } from "./utils"

interface EditGameSessionFormDialogProps {
  open: boolean
  onClose: () => void
}

export const EditGameSessionFormDialog: FC<EditGameSessionFormDialogProps> = memo(
  ({ open, onClose }) => {
    const {
      date,
      bookingOpen,
      startTime,
      endTime,
      locationName,
      locationAddress,
      memberCapacity,
      casualCapacity,
    } = useGameSessionContext()

    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      reset,
    } = useForm<z.infer<typeof gameSessionFormSchema>>({
      resolver: zodResolver(gameSessionFormSchema),
      defaultValues: {
        startTime: startTime?.slice(0, 5),
        endTime: endTime?.slice(0, 5),
        locationName,
        locationAddress,
        memberCapacity,
        casualCapacity,
      },
    })

    reset()

    const { mutate, isPending } = useEditGameSessionMutation()

    const notice = useNotice()
    const queryClient = useQueryClient()

    const onSubmit = (data: z.infer<typeof gameSessionFormSchema>) => {
      const body = JSON.stringify({
        ...data,
        date,
        startTime: `${data.startTime}:00`,
        endTime: `${data.endTime}:00`,
      })
      mutate(
        { date, body },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEY.GAME_SESSION, date],
            })
            notice({
              title: "Success!",
              description: "Game session updated successfully",
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
        },
      )
    }

    if (!bookingOpen)
      return (
        <Dialog onClose={onClose} open={open}>
          <DialogHeader>Error</DialogHeader>
          <DialogBody>An unexpected error has occurred.</DialogBody>
          <DialogFooter>
            <Button colorScheme="primary" onClick={onClose}>
              Done
            </Button>
          </DialogFooter>
        </Dialog>
      )

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogHeader>{formatFullDate(date).toLocaleString()}</DialogHeader>
        <DialogBody as="form" my="0" onSubmit={handleSubmit(onSubmit)} py="md">
          <HStack w="full">
            <TextInput
              disabled
              flex={1}
              label="Booking Open"
              readOnly
              type={InputType.Text}
              value={format(bookingOpen, "dd/MM/yy hh:mma")}
            />
            <TextInput
              disabled
              flex={1}
              label="Booking Close"
              readOnly
              type={InputType.Text}
              value={
                watch("startTime")
                  ? format(parse(watch("startTime"), "HH:mm", date), "dd/MM/yy hh:mma")
                  : format(date, "dd/MM/yy hh:mma")
              }
            />
          </HStack>
          <HStack w="full">
            <TextInput
              flex={1}
              label="Start Time"
              type={InputType.Time}
              {...register("startTime")}
              autoFocus
              errorMessage={errors.startTime?.message}
              isError={!!errors.startTime}
            />
            <TextInput
              flex={1}
              label="End Time"
              type={InputType.Time}
              {...register("endTime")}
              errorMessage={errors.endTime?.message}
              isError={!!errors.endTime}
            />
          </HStack>
          <HStack w="full">
            <TextInput
              flex={1}
              label="Location Name"
              type={InputType.Text}
              {...register("locationName")}
              errorMessage={errors.locationName?.message}
              isError={!!errors.locationName}
            />
          </HStack>
          <HStack w="full">
            <TextInput
              flex={1}
              label="Address"
              type={InputType.Text}
              {...register("locationAddress")}
              errorMessage={errors.locationAddress?.message}
              isError={!!errors.locationAddress}
            />
          </HStack>
          <HStack w="full">
            <TextInput
              flex={1}
              label="Capacity"
              type={InputType.Text}
              {...register("memberCapacity")}
              errorMessage={errors.memberCapacity?.message}
              isError={!!errors.memberCapacity}
            />
            <TextInput
              flex={1}
              label="Casual Capacity"
              type={InputType.Text}
              {...register("casualCapacity")}
              errorMessage={errors.casualCapacity?.message}
              isError={!!errors.casualCapacity}
            />
          </HStack>
        </DialogBody>
        <DialogFooter>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button colorScheme="primary" loading={isPending} type="submit">
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    )
  },
)

EditGameSessionFormDialog.displayName = "EditGameSessionFormDialog"
