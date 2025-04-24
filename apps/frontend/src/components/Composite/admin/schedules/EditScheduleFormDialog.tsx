import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { useEditScheduleMutation } from "@/hooks/mutations/schedules"
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
import { type FC, memo } from "react"
import { useScheduleContext } from "./SchedulesContext"

const formSchema = z
  .object({
    startTime: z.string().min(1, "Field is required"),
    endTime: z.string().min(1, "Field is required"),
    locationName: z.string().min(1, "Field is required"),
    locationAddress: z.string().min(1, "Field is required"),
    memberCapacity: z.coerce
      .number({ message: "Capacity must be a number" })
      .nonnegative("Capacity must be positive"),
    casualCapacity: z.coerce
      .number({ message: "Capacity must be a number" })
      .nonnegative("Capacity must be positive"),
  })
  .refine(
    (data) => {
      return !data.endTime || data.startTime < data.endTime
    },
    { message: "Start time must be before end time", path: ["startTime"] },
  )

interface EditScheduleFormDialogProps {
  open: boolean
  onClose: () => void
}

export const EditScheduleFormDialog: FC<EditScheduleFormDialogProps> = memo(({ open, onClose }) => {
  const {
    id,
    semesterId,
    weekday,
    startTime,
    endTime,
    locationName,
    locationAddress,
    memberCapacity,
    casualCapacity,
  } = useScheduleContext()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: startTime.slice(0, 5),
      endTime: endTime.slice(0, 5),
      locationName,
      locationAddress,
      memberCapacity,
      casualCapacity,
    },
  })

  const notice = useNotice()

  const queryClient = useQueryClient()
  const { mutate, isPending } = useEditScheduleMutation()

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    const body = JSON.stringify({
      semesterId: semesterId,
      weekday: weekday,
      startTime: `${data.startTime}:00`,
      endTime: `${data.endTime}:00`,
      locationName: data.locationName,
      locationAddress: data.locationAddress,
      memberCapacity: data.memberCapacity,
      casualCapacity: data.casualCapacity,
    })

    mutate(
      { id, body },
      {
        onError: () => {
          notice({
            title: "Uh oh! Something went wrong",
            description: "An error occurred while updating the schedule. Please try again.",
            status: "error",
          })
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.SCHEDULES, semesterId],
          })
          notice({
            title: "Success!",
            description: "Schedule details successfully updated",
          })
          reset({
            startTime: data.startTime,
            endTime: data.endTime,
            locationName: data.locationName,
            locationAddress: data.locationAddress,
            memberCapacity: data.memberCapacity,
            casualCapacity: data.casualCapacity,
          })
          onClose()
        },
      },
    )
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogHeader>Edit {weekday}&apos;s Schedule</DialogHeader>
      <DialogBody as="form" my="0" onSubmit={handleSubmit(onSubmit)} py="md">
        <HStack w="full">
          <TextInput
            flex={1}
            label="Start Time"
            type={InputType.Time}
            {...register("startTime")}
            autoComplete="off"
            errorMessage={errors.startTime?.message}
            isError={!!errors.startTime?.message}
          />
          <TextInput
            flex={1}
            label="End Time"
            type={InputType.Time}
            {...register("endTime")}
            autoComplete="off"
            errorMessage={errors.endTime?.message}
            isError={!!errors.endTime?.message}
          />
        </HStack>
        <HStack w="full">
          <TextInput
            flex={1}
            label="Venue Name"
            type={InputType.Text}
            {...register("locationName")}
            autoComplete="off"
            errorMessage={errors.locationName?.message}
            isError={!!errors.locationName?.message}
          />
        </HStack>
        <HStack w="full">
          <TextInput
            flex={1}
            label="Address"
            type={InputType.Text}
            {...register("locationAddress")}
            autoComplete="off"
            errorMessage={errors.locationAddress?.message}
            isError={!!errors.locationAddress?.message}
          />
        </HStack>
        <HStack w="full">
          <TextInput
            flex={1}
            label="Capacity"
            type={InputType.Number}
            {...register("memberCapacity")}
            autoComplete="off"
            errorMessage={errors.memberCapacity?.message}
            isError={!!errors.memberCapacity?.message}
          />
          <TextInput
            flex={1}
            label="Casual Capacity"
            type={InputType.Number}
            {...register("casualCapacity")}
            autoComplete="off"
            errorMessage={errors.casualCapacity?.message}
            isError={!!errors.casualCapacity?.message}
          />
        </HStack>
      </DialogBody>
      <DialogFooter>
        <Button onClick={onClose} variant="ghost">
          Cancel
        </Button>
        <Button colorScheme="primary" loading={isPending} onClick={handleSubmit(onSubmit)}>
          Update
        </Button>
      </DialogFooter>
    </Dialog>
  )
})

EditScheduleFormDialog.displayName = "EditScheduleFormDialog"
