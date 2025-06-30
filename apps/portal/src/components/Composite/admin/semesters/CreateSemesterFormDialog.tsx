import { zodResolver } from "@hookform/resolvers/zod"
import { InputType, TextInput } from "@repo/ui/components/TextInput"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  HStack,
  useNotice,
} from "@yamada-ui/react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { QUERY_KEY } from "@/lib/utils/queryKeys"
import { compareDate, formatDateInISO, validateDate } from "./utils"

interface CreateSemesterFormDialogProps {
  open: boolean
  onClose: () => void
}

const formSchema = z
  .object({
    name: z.string().min(1, "Field is required"),
    startDate: z.string().min(1, "Field is required").refine(validateDate, "Invalid date"),
    endDate: z.string().min(1, "Field is required").refine(validateDate, "Invalid date"),
    breakStart: z.string().min(1, "Field is required").refine(validateDate, "Invalid date"),
    breakEnd: z.string().min(1, "Field is required").refine(validateDate, "Invalid date"),
    bookingOpenDay: z.string().min(1, "Field is required"),
    bookingOpenTime: z.string().min(1, "Field is required"),
  })
  .refine((data) => compareDate(data.startDate, data.breakStart) < 0, {
    message: "Start date must be before break start date",
    path: ["startDate"],
  })
  .refine((data) => compareDate(data.breakStart, data.breakEnd) < 0, {
    message: "Break start date start must be before break end date",
    path: ["breakStart"],
  })
  .refine((data) => compareDate(data.breakEnd, data.endDate) < 0, {
    message: "Break end date must be before end date",
    path: ["breakEnd"],
  })

export const CreateSemesterFormDialog = ({ open, onClose }: CreateSemesterFormDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) })

  const notice = useNotice()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (body: BodyInit) => {
      const response = await fetch("/api/semesters", {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === "DUPLICATE_NAME") {
          setError("name", { message: data.message })
        }
        throw new Error(data.code)
      }
      return data
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    const newSemester = JSON.stringify({
      name: data.name,
      startDate: formatDateInISO(data.startDate),
      endDate: formatDateInISO(data.endDate),
      breakStart: formatDateInISO(data.breakStart),
      breakEnd: formatDateInISO(data.breakEnd),
      bookingOpenDay: data.bookingOpenDay,
      bookingOpenTime: `${data.bookingOpenTime}:00`,
    })

    mutation.mutate(newSemester, {
      onError: (e) => {
        if (e.message === "DUPLICATE_NAME") return
        if (e.message === "OVERLAPPING_SEMESTER") {
          notice({
            title: "Overlapping Semester",
            description:
              "The semester dates overlap with an existing semester. Please adjust the dates.",
            status: "error",
          })
        } else {
          notice({
            title: "Uh oh! Something went wrong",
            description: "An error occurred while updating the semester. Please try again.",
            status: "error",
          })
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SEMESTERS] })
        notice({
          title: "Success!",
          description: "Semester successfully created.",
        })
        reset()
        onClose()
      },
    })
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogHeader>Create a new semester</DialogHeader>
      <DialogBody as="form" my="0" onSubmit={handleSubmit(onSubmit)} py="md">
        <TextInput
          label="Name"
          type={InputType.Text}
          w="full"
          {...register("name")}
          autoComplete="off"
          errorMessage={errors.name?.message}
          isError={!!errors.name?.message}
        />
        <HStack w="full">
          <TextInput
            flex={1}
            label="Open day"
            type={InputType.Date}
            {...register("bookingOpenDay")}
            autoComplete="off"
            errorMessage={errors.bookingOpenDay?.message}
            isError={!!errors.bookingOpenDay?.message}
          />
          <TextInput
            flex={1}
            label="Open time"
            type={InputType.Time}
            {...register("bookingOpenTime")}
            autoComplete="off"
            errorMessage={errors.bookingOpenTime?.message}
            isError={!!errors.bookingOpenTime?.message}
          />
        </HStack>
        <HStack w="full">
          <TextInput
            flex={1}
            label="Start date"
            type={InputType.Date}
            {...register("startDate")}
            errorMessage={errors.startDate?.message}
            isError={!!errors.startDate?.message}
          />
          <TextInput
            flex={1}
            label="End date"
            type={InputType.Date}
            {...register("endDate")}
            errorMessage={errors.endDate?.message}
            isError={!!errors.endDate?.message}
          />
        </HStack>
        <HStack gap="md" w="full">
          <TextInput
            flex={1}
            label="Break start date"
            type={InputType.Date}
            {...register("breakStart")}
            errorMessage={errors.breakStart?.message}
            isError={!!errors.breakStart?.message}
          />
          <TextInput
            flex={1}
            label="Break end date"
            type={InputType.Date}
            {...register("breakEnd")}
            errorMessage={errors.breakEnd?.message}
            isError={!!errors.breakEnd?.message}
          />
        </HStack>
      </DialogBody>
      <DialogFooter>
        <Button onClick={onClose} variant="ghost">
          Cancel
        </Button>
        <Button colorScheme="primary" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
          Create
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
