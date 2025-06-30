import { zodResolver } from "@hookform/resolvers/zod"
import { InputType, TextInput } from "@repo/ui/components/TextInput"
import { useQueryClient } from "@tanstack/react-query"
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  HStack,
  useNotice,
} from "@yamada-ui/react"
import { format, getMonth, getYear, parse } from "date-fns"
import { type FC, memo } from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { useCreateGameSessionMutation } from "@/hooks/mutations/game-sessions"
import { formatFullDate } from "@/lib/utils/dates"
import { QUERY_KEY } from "@/lib/utils/queryKeys"
import { useGameSessionContext } from "./GameSessionContext"
import { gameSessionFormSchema } from "./utils"

interface CreateGameSessionFormDialogProps {
  open: boolean
  onClose: () => void
}

export const CreateGameSessionFormDialog: FC<CreateGameSessionFormDialogProps> = memo(
  ({ open, onClose }) => {
    const { date, bookingOpen } = useGameSessionContext()
    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      reset,
    } = useForm<z.infer<typeof gameSessionFormSchema>>({
      resolver: zodResolver(gameSessionFormSchema),
    })

    const { mutate, isPending } = useCreateGameSessionMutation()

    const notice = useNotice()

    const queryClient = useQueryClient()

    const onSubmit = (data: z.infer<typeof gameSessionFormSchema>) => {
      const body = JSON.stringify({
        ...data,
        date,
        startTime: `${data.startTime}:00`,
        endTime: `${data.endTime}:00`,
      })
      mutate(body, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.GAME_SESSION, date],
          })
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.ACTIVE_DATES, getYear(date), getMonth(date)],
          })
          notice({
            title: "Success!",
            description: "Game session created successfully",
          })
          onClose()
        },
        onError: () => {
          notice({
            title: "Uh oh! Something went wrong",
            description: "An error occurred while creating the game session. Please try again.",
            status: "error",
          })
        },
      })
    }

    const handleCancel = () => {
      reset()
      onClose()
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
          <Button onClick={handleCancel} variant="ghost">
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

CreateGameSessionFormDialog.displayName = "CreateGameSessionFormDialog"
