"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  CreateGameSchedulePopUpFormDataSchema,
  type CreateGameSchedulePopUpFormValues,
  isoToTimeInput,
  Weekday,
} from "@repo/shared"
import type { GameSessionSchedule } from "@repo/shared/payload-types"
import { Button, Heading, Select, TextInput } from "@repo/ui/components/Primitive"
import { InputType } from "@repo/ui/components/Primitive/TextInput/types"
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  Clock3Icon,
  MapPinIcon,
  UserRoundIcon,
} from "@yamada-ui/lucide"
import {
  ButtonGroup,
  Center,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  type DialogProps,
  FormControl,
  Grid,
  GridItem,
  VStack,
} from "@yamada-ui/react"
import type { FC } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"

export interface CreateGameSchedulePopUpProps extends DialogProps {
  title?: string
  scheduleToEdit?: GameSessionSchedule | null
  onConfirm?: (data: CreateGameSchedulePopUpFormValues) => void
}

const WeekdayOptions = Object.values(Weekday).map((day) => ({
  value: day,
  label: day.charAt(0).toUpperCase() + day.slice(1),
}))

export const CreateGameSchedulePopUp: FC<CreateGameSchedulePopUpProps> = ({
  title = "Create Game Schedule",
  scheduleToEdit,
  onConfirm,
  ...props
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateGameSchedulePopUpFormValues>({
    resolver: zodResolver(CreateGameSchedulePopUpFormDataSchema),
    defaultValues: scheduleToEdit
      ? {
          name: scheduleToEdit.name,
          location: scheduleToEdit.location,
          day: scheduleToEdit.day,
          capacity: scheduleToEdit.capacity,
          casualCapacity: scheduleToEdit.casualCapacity,
          startTime: isoToTimeInput(scheduleToEdit.startTime),
          endTime: isoToTimeInput(scheduleToEdit.endTime),
        }
      : undefined,
  })

  const handleClose = () => {
    reset()
    props.onClose?.()
  }

  const onSubmit: SubmitHandler<CreateGameSchedulePopUpFormValues> = (data) => {
    onConfirm?.(data)
    handleClose()
  }

  return (
    <Dialog
      alignItems="center"
      as="form"
      bg={["secondary.50", "secondary.900"]}
      boxShadow="0px 1.5px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.1)"
      gap={{ base: "6", md: "6.5" }}
      h="fit-content"
      justifyContent="center"
      layerStyle="gradientBorder"
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      p={{ base: "6", md: "13" }}
      rounded="2xl"
      size="3xl"
      {...props}
    >
      <DialogOverlay />
      <DialogCloseButton bg="black" layerStyle="gradientBorder" rounded="full" />
      <DialogHeader justifyContent="center" w="full">
        <VStack gap="4">
          <Heading.h2
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight={{ base: "medium", md: "medium" }}
            textAlign="center"
          >
            {title}
          </Heading.h2>
        </VStack>
      </DialogHeader>
      <DialogBody overflow="visible" w="full">
        <Center w="full">
          <VStack gap="6" w="full">
            <Grid gap="lg" templateColumns={{ base: "1fr", lg: "1fr 1fr" }} w="full">
              <GridItem as={VStack} gap="md">
                <FormControl errorMessage={errors.name?.message} invalid={!!errors.name}>
                  <TextInput
                    data-testid="name"
                    placeholder="Name"
                    size="lg"
                    type={InputType.Text}
                    {...register("name")}
                  />
                </FormControl>
                <FormControl errorMessage={errors.location?.message} invalid={!!errors.location}>
                  <TextInput
                    data-testid="location"
                    placeholder="Location"
                    size="lg"
                    startElement={<MapPinIcon />}
                    type={InputType.Text}
                    {...register("location")}
                  />
                </FormControl>
                <FormControl errorMessage={errors.day?.message} invalid={!!errors.day}>
                  <Controller
                    control={control}
                    name="day"
                    render={({ field }) => (
                      <Select
                        data-testid="day"
                        icon={<CalendarDaysIcon />}
                        items={WeekdayOptions}
                        {...field}
                      />
                    )}
                  />
                </FormControl>
                <FormControl errorMessage={errors.capacity?.message} invalid={!!errors.capacity}>
                  <TextInput
                    data-testid="capacity"
                    placeholder="Capacity"
                    size="lg"
                    startElement={<UserRoundIcon />}
                    type={InputType.Number}
                    {...register("capacity")}
                  />
                </FormControl>
              </GridItem>
              <GridItem as={VStack} gap="md">
                <FormControl
                  errorMessage={errors.casualCapacity?.message}
                  invalid={!!errors.casualCapacity}
                >
                  <TextInput
                    data-testid="casual-capacity"
                    placeholder="Casual Capacity"
                    size="lg"
                    startElement={<UserRoundIcon />}
                    type={InputType.Number}
                    {...register("casualCapacity")}
                  />
                </FormControl>
                <FormControl errorMessage={errors.startTime?.message} invalid={!!errors.startTime}>
                  <TextInput
                    data-testid="start-time"
                    placeholder="Start Time"
                    size="lg"
                    startElement={<Clock3Icon />}
                    type={InputType.Time}
                    {...register("startTime")}
                  />
                </FormControl>
                <FormControl errorMessage={errors.endTime?.message} invalid={!!errors.endTime}>
                  <TextInput
                    data-testid="end-time"
                    placeholder="End Time"
                    size="lg"
                    startElement={<Clock3Icon />}
                    type={InputType.Time}
                    {...register("endTime")}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </VStack>
        </Center>
      </DialogBody>
      <DialogFooter gap="6.5" w="full">
        <ButtonGroup
          flexDirection={{ base: "column", md: "row" }}
          gap={{ base: "4", md: "6.5" }}
          w="full"
        >
          <Button
            colorScheme="secondary"
            data-testid="back"
            onClick={handleClose}
            size="lg"
            startIcon={<ArrowLeftIcon />}
            w="full"
          >
            Back
          </Button>
          <Button
            colorScheme="primary"
            data-testid="submit"
            loading={isSubmitting}
            size="lg"
            type="submit"
            w="full"
          >
            Confirm
          </Button>
        </ButtonGroup>
      </DialogFooter>
    </Dialog>
  )
}

CreateGameSchedulePopUp.displayName = "CreateGameSchedulePopUp"
