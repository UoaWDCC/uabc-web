import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { format, getMonth, getYear, parse } from 'date-fns'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { InputType, TextInput } from '@/components/Generic/TextInput'
import { useCreateGameSessionMutation } from '@/hooks/mutations/game-sessions'
import { formatFullDate } from '@/lib/utils/dates'
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
import { type FC, memo } from 'react'
import { useGameSessionContext } from './GameSessionContext'
import { gameSessionFormSchema } from './utils'

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
            title: 'Success!',
            description: 'Game session created successfully',
          })
          onClose()
        },
        onError: () => {
          notice({
            title: 'Uh oh! Something went wrong',
            description: 'An error occurred while creating the game session. Please try again.',
            status: 'error',
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
        <Dialog open={open} onClose={onClose}>
          <DialogHeader>Error</DialogHeader>
          <DialogBody>An unexpected error has occurred.</DialogBody>
          <DialogFooter>
            <Button onClick={onClose} colorScheme="primary">
              Done
            </Button>
          </DialogFooter>
        </Dialog>
      )

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogHeader>{formatFullDate(date).toLocaleString()}</DialogHeader>
        <DialogBody as="form" onSubmit={handleSubmit(onSubmit)} my="0" py="md">
          <HStack w="full">
            <TextInput
              label="Booking Open"
              type={InputType.Text}
              flex={1}
              value={format(bookingOpen, 'dd/MM/yy hh:mma')}
              readOnly
              disabled
            />
            <TextInput
              label="Booking Close"
              type={InputType.Text}
              flex={1}
              value={
                watch('startTime')
                  ? format(parse(watch('startTime'), 'HH:mm', date), 'dd/MM/yy hh:mma')
                  : format(date, 'dd/MM/yy hh:mma')
              }
              readOnly
              disabled
            />
          </HStack>
          <HStack w="full">
            <TextInput
              label="Start Time"
              type={InputType.Time}
              flex={1}
              {...register('startTime')}
              isError={!!errors.startTime}
              errorMessage={errors.startTime?.message}
              autoFocus
            />
            <TextInput
              label="End Time"
              type={InputType.Time}
              flex={1}
              {...register('endTime')}
              isError={!!errors.endTime}
              errorMessage={errors.endTime?.message}
            />
          </HStack>
          <HStack w="full">
            <TextInput
              flex={1}
              label="Location Name"
              type={InputType.Text}
              {...register('locationName')}
              isError={!!errors.locationName}
              errorMessage={errors.locationName?.message}
            />
          </HStack>
          <HStack w="full">
            <TextInput
              flex={1}
              label="Address"
              type={InputType.Text}
              {...register('locationAddress')}
              isError={!!errors.locationAddress}
              errorMessage={errors.locationAddress?.message}
            />
          </HStack>
          <HStack w="full">
            <TextInput
              flex={1}
              label="Capacity"
              type={InputType.Text}
              {...register('memberCapacity')}
              isError={!!errors.memberCapacity}
              errorMessage={errors.memberCapacity?.message}
            />
            <TextInput
              flex={1}
              label="Casual Capacity"
              type={InputType.Text}
              {...register('casualCapacity')}
              isError={!!errors.casualCapacity}
              errorMessage={errors.casualCapacity?.message}
            />
          </HStack>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button colorScheme="primary" type="submit" loading={isPending}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    )
  },
)

CreateGameSessionFormDialog.displayName = 'CreateGameSessionFormDialog'
