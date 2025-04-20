import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { QUERY_KEY } from '@/lib/utils/queryKeys'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  HStack,
  useNotice,
} from '@yamada-ui/react'
import { TextInput } from '../../../Generic/TextInput'
import { useSemesterContext } from './SemestersContext'
import { compareDate, formatDateInISO, validateDate } from './utils'

// Schema
const formSchema = z
  .object({
    startDate: z.string().min(1, 'Field is required').refine(validateDate, 'Invalid date'),
    endDate: z.string().min(1, 'Field is required').refine(validateDate, 'Invalid date'),
    breakStart: z.string().min(1, 'Field is required').refine(validateDate, 'Invalid date'),
    breakEnd: z.string().min(1, 'Field is required').refine(validateDate, 'Invalid date'),
    bookingOpenDay: z.string().min(1, 'Field is required'),
    bookingOpenTime: z.string().min(1, 'Field is required'),
  })
  .refine((data) => compareDate(data.startDate, data.breakStart) < 0, {
    message: 'Start date must be before break start date',
    path: ['startDate'],
  })
  .refine((data) => compareDate(data.breakStart, data.breakEnd) < 0, {
    message: 'Break start date start must be before break end date',
    path: ['breakStart'],
  })
  .refine((data) => compareDate(data.breakEnd, data.endDate) < 0, {
    message: 'Break end date must be before end date',
    path: ['breakEnd'],
  })

interface EditSemesterFormDialogProps {
  open: boolean
  onClose: () => void
}

export const EditSemesterFormDialog = ({ open, onClose }: EditSemesterFormDialogProps) => {
  // Contexts
  const {
    name,
    startDate,
    endDate,
    breakStart,
    breakEnd,
    id: semesterId,
    bookingOpenDay,
    bookingOpenTime,
  } = useSemesterContext()

  // Hook-forms
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: formatDateInISO(startDate),
      endDate: formatDateInISO(endDate),
      breakStart: formatDateInISO(breakStart),
      breakEnd: formatDateInISO(breakEnd),
      bookingOpenDay: formatDateInISO(bookingOpenDay),
      bookingOpenTime: bookingOpenTime.slice(0, 5),
    },
  })

  const notice = useNotice()

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (body: BodyInit) => {
      const response = await fetch(`/api/semesters/${semesterId}`, {
        method: 'PUT',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error((await response.json()).code)
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    const body = JSON.stringify({
      name,
      bookingOpenDay: data.bookingOpenDay,
      bookingOpenTime: `${data.bookingOpenTime}:00`,
      startDate: formatDateInISO(data.startDate),
      endDate: formatDateInISO(data.endDate),
      breakStart: formatDateInISO(data.breakStart),
      breakEnd: formatDateInISO(data.breakEnd),
    })

    mutation.mutate(body, {
      onError: (e) => {
        if (e.message === 'OVERLAPPING_SEMESTER') {
          notice({
            title: 'Overlapping Semester',
            description:
              'The semester dates overlap with an existing semester. Please adjust the dates.',
            status: 'error',
          })
        } else {
          notice({
            title: 'Uh oh! Something went wrong',
            description: 'An error occurred while updating the semester. Please try again.',
            status: 'error',
          })
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SEMESTERS] })
        notice({
          title: 'Success!',
          description: 'Semester details successfully updated',
        })
        reset({
          startDate: data.startDate,
          endDate: data.endDate,
          breakStart: data.breakStart,
          breakEnd: data.breakEnd,
          bookingOpenDay: data.bookingOpenDay,
          bookingOpenTime: data.bookingOpenTime,
        })
        onClose()
      },
    })
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>Edit {name}</DialogHeader>
      <DialogBody as="form" onSubmit={handleSubmit(onSubmit)} my="0" py="md">
        <HStack w="full">
          <TextInput
            label="Open day"
            type="date"
            flex={1}
            {...register('bookingOpenDay')}
            isError={!!errors.bookingOpenDay?.message}
            errorMessage={errors.bookingOpenDay?.message}
            autoComplete="off"
          />
          <TextInput
            label="Open time"
            type="time"
            flex={1}
            {...register('bookingOpenTime')}
            isError={!!errors.bookingOpenTime?.message}
            errorMessage={errors.bookingOpenTime?.message}
            autoComplete="off"
          />
        </HStack>
        <HStack w="full">
          <TextInput
            type="date"
            label="Start date"
            flex={1}
            {...register('startDate')}
            isError={!!errors.startDate?.message}
            errorMessage={errors.startDate?.message}
          />
          <TextInput
            type="date"
            label="End date"
            flex={1}
            {...register('endDate')}
            isError={!!errors.endDate?.message}
            errorMessage={errors.endDate?.message}
          />
        </HStack>
        <HStack w="full" gap="md">
          <TextInput
            type="date"
            label="Break start date"
            flex={1}
            {...register('breakStart')}
            isError={!!errors.breakStart?.message}
            errorMessage={errors.breakStart?.message}
          />
          <TextInput
            type="date"
            label="Break end date"
            flex={1}
            {...register('breakEnd')}
            isError={!!errors.breakEnd?.message}
            errorMessage={errors.breakEnd?.message}
          />
        </HStack>
      </DialogBody>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button colorScheme="primary" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
          Update
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
