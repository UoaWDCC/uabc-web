import { Button, Heading, TextInput } from "@repo/ui/components/Primitive"
import { InputType } from "@repo/ui/components/Primitive/TextInput/types"
import { ArrowLeftIcon, Clock3Icon, UserRoundIcon } from "@yamada-ui/lucide"
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
  Label,
  Option,
  Select,
  VStack,
} from "@yamada-ui/react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"

/**
 * Props for {@link CreateSessionPopUp} component
 */
interface FormData {
  weekDay: string
  sessionType: string
  startTime: string
  endTime: string
  memberCapacity: number
  casualCapacity: number
}

export interface CreateSessionPopUpProps extends DialogProps {
  /**
   * The title to display in the dialog header
   */
  title: string

  /**
   * The description text to display in the dialog body
   */
  description: string

  /**
   * The default start time for the session.
   * Used to pre-populate the start time input.
   */
  startTime: Date

  /**
   * The default end time for the session.
   * Used to pre-populate the end time input.
   */
  endTime: Date

  /**
   * The default member capacity for the session.
   * Used to pre-populate the member capacity input.
   */
  memberCapacity: number

  /**
   * The default casual capacity for the session.
   * Used to pre-populate the casual capacity input.
   */
  casualCapacity: number

  /**
   * The list of weekday options for the session.
   * Each option should have a label and value.
   */
  weekDay: {
    label: string
    value: string
  }[]

  /**
   * The list of session type options.
   * Each option should have a label and value.
   */
  sessionType: {
    label: string
    value: string
  }[]

  /**
   * The function to call when the form is submitted
   */
  onConfirm: (value: FormData) => void

  /**
   * The placeholder text for the input fields.
   */
  inputPlaceholder: string
}

/**
 * Dialog component for collecting user input with a title and description
 *
 * Renders a modal dialog with a title heading, description text, and input fields,
 * designed to collect user input in a clean, accessible interface.
 *
 * @param props CreateSessionPopUp component properties
 * @returns A modal dialog with title, description, and input fields
 *
 * @example
 /**
  * Example usage:
  * 
  * <CreateSessionPopUp
  *   isOpen={isOpen}
  *   onClose={handleClose}
  *   title="Create New Session"
  *   description="Fill in the details below to create a new session."
  *   startTime={new Date()}
  *   endTime={new Date()}
  *   memberCapacity={20}
  *   casualCapacity={10}
  *   weekDay={[
  *     { label: "Monday", value: "monday" },
  *     { label: "Tuesday", value: "tuesday" },
  *     // ...other days
  *   ]}
  *   sessionType={[
  *     { label: "Member", value: "member" },
  *     { label: "Casual", value: "casual" },
  *   ]}
  *   onConfirm={(value) => {
  *     // handle the confirmed value
  *     console.log("Session name:", value)
  *   }}
  * />
  */
export const CreateSessionPopUp: React.FC<CreateSessionPopUpProps> = ({
  title,
  description,
  onConfirm,
  sessionType,
  weekDay,
  startTime,
  endTime,
  memberCapacity,
  casualCapacity,
  inputPlaceholder,
  ...props
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const handleClose = () => {
    reset()
    props.onClose?.()
  }
  const onSubmit: SubmitHandler<FormData> = (data) => {
    onConfirm(data)
    reset()
    props.onClose?.()
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
          <Heading.h3 fontWeight="light" size={{ sm: "lg", md: "2xl" }} textAlign="center" w="full">
            {description}
          </Heading.h3>
        </VStack>
      </DialogHeader>
      <DialogBody overflow="visible" w="full">
        <Center w="full">
          <VStack gap="6" maxW="md" w="full">
            <FormControl
              errorMessage={errors.sessionType?.message}
              invalid={!!errors.sessionType}
              w="full"
            >
              <Label color={["gray.700", "gray.300"]} fontSize="sm">
                Ongoing or One-off
              </Label>
              <Controller
                control={control}
                name="sessionType"
                render={({ field }) => (
                  <Select
                    bgGradient="secondaryGradient"
                    fontSize="md"
                    h="10"
                    id="sessionType"
                    onChange={field.onChange}
                    placeholder="Select Session Type"
                    rounded="md"
                    size="lg"
                    value={field.value}
                  >
                    {sessionType.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                )}
                rules={{ required: "Session type is required." }}
              />
            </FormControl>
            <FormControl
              errorMessage={errors.weekDay?.message}
              invalid={!!errors.weekDay}
              position="relative"
              w="full"
            >
              <Controller
                control={control}
                name="weekDay"
                render={({ field }) => (
                  <Select
                    bgGradient="secondaryGradient"
                    fontSize="md"
                    h="10"
                    id="weekDay"
                    onChange={field.onChange}
                    placeholder="Select Weekday"
                    rounded="md"
                    size="lg"
                    value={field.value}
                  >
                    {weekDay.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                )}
                rules={{ required: "Weekday is required." }}
              />
            </FormControl>
            <FormControl
              errorMessage={errors.startTime?.message}
              invalid={!!errors.startTime}
              w="full"
            >
              <TextInput
                endIcon={<Clock3Icon fontSize={24} />}
                id="startTime"
                label="Select Start Time"
                placeholder={description.split(":")[0]}
                size="lg"
                type={InputType.Time}
                {...register("startTime", { required: "This field is required." })}
              />
            </FormControl>
            <FormControl errorMessage={errors.endTime?.message} invalid={!!errors.endTime} w="full">
              <TextInput
                endIcon={<Clock3Icon fontSize={24} />}
                id="endTime"
                label="Select End Time"
                placeholder={description.split(":")[0]}
                size="lg"
                type={InputType.Time}
                w="full"
                {...register("endTime", {
                  required: "This field is required.",
                  validate: (value) => {
                    const startTime = watch("startTime")
                    if (startTime && value) {
                      const start = new Date(`2000-01-01T${startTime}`)
                      const end = new Date(`2000-01-01T${value}`)
                      return end > start || "End time must be after start time."
                    }
                    return true
                  },
                })}
              />
            </FormControl>
            <FormControl
              errorMessage={errors.memberCapacity?.message}
              invalid={!!errors.memberCapacity}
              w="full"
            >
              <TextInput
                endIcon={<UserRoundIcon fontSize={24} />}
                id="memberCapacity"
                label="Member Capacity"
                placeholder={inputPlaceholder}
                size="lg"
                type={InputType.Number}
                {...register("memberCapacity", {
                  required: "This field is required.",
                  valueAsNumber: true,
                  min: { value: 1, message: "Capacity must be at least 1" },
                })}
              />
            </FormControl>
            <FormControl
              errorMessage={errors.casualCapacity?.message}
              invalid={!!errors.casualCapacity}
              w="full"
            >
              <TextInput
                endIcon={<UserRoundIcon fontSize={24} />}
                id="casualCapacity"
                label="Casual Capacity"
                placeholder={inputPlaceholder}
                size="lg"
                type={InputType.Number}
                {...register("casualCapacity", {
                  required: "This field is required.",
                  valueAsNumber: true,
                  min: { value: 1, message: "Capacity must be at least 1" },
                })}
              />
            </FormControl>
          </VStack>
        </Center>
      </DialogBody>
      <DialogFooter gap="6.5" w="full">
        <ButtonGroup
          direction={{ base: "column", md: "row" }}
          gap={{ base: "4", md: "6.5" }}
          w="full"
        >
          <Button colorScheme="primary" isLoading={isSubmitting} size="lg" type="submit" w="full">
            Confirm
          </Button>
          <Button
            colorScheme="secondary"
            leftIcon={<ArrowLeftIcon />}
            onClick={handleClose}
            size="lg"
            w="full"
          >
            Back
          </Button>
        </ButtonGroup>
      </DialogFooter>
    </Dialog>
  )
}

CreateSessionPopUp.displayName = "CreateSessionPopUp"
