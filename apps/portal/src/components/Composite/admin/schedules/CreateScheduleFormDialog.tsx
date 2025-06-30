import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { useCreateScheduleMutation } from "@/hooks/mutations/schedules"
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

interface ScheduleCreateDialogProps {
  semesterId: number
  open: boolean
  onClose: () => void
}

const formSchema = z
  .object({
    // TODO: Add weekday enum
    weekday: z.string(),
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

export const CreateScheduleFormDialog = ({
  semesterId,
  open,
  onClose,
}: ScheduleCreateDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) })

  const notice = useNotice()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useCreateScheduleMutation()

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    const body = JSON.stringify({
      weekday: data.weekday,
      startTime: `${data.startTime}:00`,
      endTime: `${data.endTime}:00`,
      locationName: data.locationName,
      locationAddress: data.locationAddress,
      memberCapacity: data.memberCapacity,
      casualCapacity: data.casualCapacity,
    })

    mutate(
      {
        semesterId,
        body,
      },
      {
        onError: () => {
          notice({
            title: "Uh oh! Something went wrong",
            description: "An error occurred while creating the schedule. Please try again.",
            status: "error",
          })
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.SCHEDULES, semesterId],
          })
          notice({
            title: "Success!",
            description: "Successfully created schedule",
          })
          reset()
          onClose()
        },
      },
    )
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogHeader>Create a new schedule</DialogHeader>
      <DialogBody as="form" my="0" onSubmit={handleSubmit(onSubmit)} py="md">
        <TextInput
          label="Day"
          type={InputType.Date}
          w="full"
          {...register("weekday")}
          autoComplete="off"
          errorMessage={errors.weekday?.message}
          isError={!!errors.weekday?.message}
        />
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
        <TextInput
          label="Venue Name"
          type={InputType.Text}
          w="full"
          {...register("locationName")}
          autoComplete="off"
          errorMessage={errors.locationName?.message}
          isError={!!errors.locationName?.message}
        />
        <TextInput
          label="Address"
          type={InputType.Text}
          w="full"
          {...register("locationAddress")}
          autoComplete="off"
          errorMessage={errors.locationAddress?.message}
          isError={!!errors.locationAddress?.message}
        />
        <HStack w="full">
          <TextInput
            flex={1}
            label="Capacity"
            type={InputType.Text}
            {...register("memberCapacity")}
            autoComplete="off"
            errorMessage={errors.memberCapacity?.message}
            isError={!!errors.memberCapacity?.message}
          />
          <TextInput
            flex={1}
            label="Casual Capacity"
            type={InputType.Text}
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
          Create
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
