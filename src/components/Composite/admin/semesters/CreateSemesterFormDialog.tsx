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
import { InputType, TextInput } from '../../../Generic/TextInput'
import { compareDate, formatDateInISO, validateDate } from './utils'

interface CreateSemesterFormDialogProps {
  open: boolean
  onClose: () => void
}

const formSchema = z
  .object({
    name: z.string().min(1, 'Field is required'),
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
      const response = await fetch('/api/semesters', {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === 'DUPLICATE_NAME') {
          setError('name', { message: data.message })
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
        if (e.message === 'DUPLICATE_NAME') return
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
          description: 'Semester successfully created.',
        })
        reset()
        onClose()
      },
    })
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>Create a new semester</DialogHeader>
      <DialogBody as="form" onSubmit={handleSubmit(onSubmit)} my="0" py="md">
        <TextInput
          label="Name"
          type={InputType.Text}
          w="full"
          {...register('name')}
          isError={!!errors.name?.message}
          errorMessage={errors.name?.message}
          autoComplete="off"
        />
        <HStack w="full">
          <TextInput
            label="Open day"
            type={InputType.Date}
            flex={1}
            {...register('bookingOpenDay')}
            isError={!!errors.bookingOpenDay?.message}
            errorMessage={errors.bookingOpenDay?.message}
            autoComplete="off"
          />
          <TextInput
            label="Open time"
            type={InputType.Time}
            flex={1}
            {...register('bookingOpenTime')}
            isError={!!errors.bookingOpenTime?.message}
            errorMessage={errors.bookingOpenTime?.message}
            autoComplete="off"
          />
        </HStack>
        <HStack w="full">
          <TextInput
            type={InputType.Date}
            label="Start date"
            flex={1}
            {...register('startDate')}
            isError={!!errors.startDate?.message}
            errorMessage={errors.startDate?.message}
          />
          <TextInput
            type={InputType.Date}
            label="End date"
            flex={1}
            {...register('endDate')}
            isError={!!errors.endDate?.message}
            errorMessage={errors.endDate?.message}
          />
        </HStack>
        <HStack w="full" gap="md">
          <TextInput
            type={InputType.Date}
            label="Break start date"
            flex={1}
            {...register('breakStart')}
            isError={!!errors.breakStart?.message}
            errorMessage={errors.breakStart?.message}
          />
          <TextInput
            type={InputType.Date}
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
          Create
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
