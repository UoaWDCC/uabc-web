import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { InputType, TextInput } from "@/components/Generic/TextInput"
import { useCreateScheduleMutation } from "@/hooks/mutations/schedules"
import { QUERY_KEY } from "@/lib/utils/queryKeys"
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
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>Create a new schedule</DialogHeader>
      <DialogBody as="form" onSubmit={handleSubmit(onSubmit)} my="0" py="md">
        <TextInput
          label="Day"
          type={InputType.Date}
          w="full"
          {...register("weekday")}
          isError={!!errors.weekday?.message}
          errorMessage={errors.weekday?.message}
          autoComplete="off"
        />
        <HStack w="full">
          <TextInput
            label="Start Time"
            type={InputType.Time}
            flex={1}
            {...register("startTime")}
            isError={!!errors.startTime?.message}
            errorMessage={errors.startTime?.message}
            autoComplete="off"
          />
          <TextInput
            label="End Time"
            type={InputType.Time}
            flex={1}
            {...register("endTime")}
            isError={!!errors.endTime?.message}
            errorMessage={errors.endTime?.message}
            autoComplete="off"
          />
        </HStack>
        <TextInput
          label="Venue Name"
          type={InputType.Text}
          w="full"
          {...register("locationName")}
          isError={!!errors.locationName?.message}
          errorMessage={errors.locationName?.message}
          autoComplete="off"
        />
        <TextInput
          label="Address"
          type={InputType.Text}
          w="full"
          {...register("locationAddress")}
          isError={!!errors.locationAddress?.message}
          errorMessage={errors.locationAddress?.message}
          autoComplete="off"
        />
        <HStack w="full">
          <TextInput
            label="Capacity"
            type={InputType.Text}
            flex={1}
            {...register("memberCapacity")}
            isError={!!errors.memberCapacity?.message}
            errorMessage={errors.memberCapacity?.message}
            autoComplete="off"
          />
          <TextInput
            label="Casual Capacity"
            type={InputType.Text}
            flex={1}
            {...register("casualCapacity")}
            isError={!!errors.casualCapacity?.message}
            errorMessage={errors.casualCapacity?.message}
            autoComplete="off"
          />
        </HStack>
      </DialogBody>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button colorScheme="primary" loading={isPending} onClick={handleSubmit(onSubmit)}>
          Create
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
