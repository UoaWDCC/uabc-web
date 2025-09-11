import { Gender, MembershipType, PlayLevel, University } from "@repo/shared"
import { Button, Heading, Select, TextInput } from "@repo/ui/components/Primitive"
import { AutoCompleteType, InputType } from "@repo/ui/components/Primitive/TextInput/types"
import {
  ArrowLeftIcon,
  BeanOffIcon,
  FolderPenIcon,
  IdCardIcon,
  MailIcon,
  UniversityIcon,
  UserIcon,
  VenusAndMarsIcon,
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
  VStack,
} from "@yamada-ui/react"
import type { FC } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  gender: Gender
  playLevel: PlayLevel
  university: University
  studentId: string
  studentUpi: string
  role: MembershipType
  dietaryRequirements: string
  remainingSessions: number
}

export interface CreateMemberPopUpProps extends DialogProps {
  /**
   * The title to display in the dialog header
   */
  title?: string

  defaultValues?: Partial<FormData>

  /**
   * The function to call when the form is submitted
   */
  onConfirm: (value: FormData) => void
}

/**
 * Options for the University Select component, using enum values from {@link University}.
 * TODO: could perhaps put these in `shared` since it is now used in a bunch of places
 */
const universityOptions = Object.values(University).map((university) => ({
  value: university,
  label: university,
}))

/**
 * Options for the Gender Select component, using enum values from {@link Gender}.
 */
const genderOptions = Object.values(Gender).map((gender) => ({
  value: gender,
  label: gender,
}))

/**
 * Options for the Skill Level Select component, using enum values from {@link PlayLevel}.
 */
const playLevelOptions = Object.values(PlayLevel).map((playLevel) => ({
  value: playLevel,
  label: playLevel,
}))

/**
 * Options for the Role Select component, using enum values from {@link MembershipType}
 */
const roleOptions = Object.values(MembershipType).map((membershipType) => ({
  value: membershipType,
  label: membershipType,
}))

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
  *   inputPlaceholder="Enter Number"
  *   onConfirm={(value) => {
  *     // handle the confirmed value
  *     console.log("Session name:", value)
  *   }}
  * />
  */
export const CreateMemberPopUp: FC<CreateMemberPopUpProps> = ({
  title = "Create New Member",
  defaultValues,
  onConfirm,
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
        </VStack>
      </DialogHeader>
      <DialogBody overflow="visible" w="full">
        <Center w="full">
          <VStack gap="6" maxW="md" w="full">
            <FormControl errorMessage={errors.firstName?.message} invalid={!!errors.firstName}>
              <TextInput
                data-testid="first-name"
                defaultValue={defaultValues?.firstName}
                placeholder="First name"
                size="lg"
                startElement={<FolderPenIcon />}
                type={InputType.Text}
                {...register("firstName")}
              />
            </FormControl>
            <FormControl errorMessage={errors.lastName?.message} invalid={!!errors.lastName}>
              <TextInput
                data-testid="last-name"
                defaultValue={defaultValues?.lastName}
                placeholder="Lastname"
                size="lg"
                startElement={<FolderPenIcon />}
                type={InputType.Text}
                {...register("lastName")}
              />
            </FormControl>
            <FormControl errorMessage={errors.email?.message} invalid={!!errors.email}>
              <TextInput
                autoComplete={AutoCompleteType.Email}
                data-testid="email"
                defaultValue={defaultValues?.email}
                placeholder="Email Address"
                startElement={<MailIcon />}
                type={InputType.Email}
                {...register("email")}
              />
            </FormControl>
            <FormControl errorMessage={errors.phoneNumber?.message} invalid={!!errors.phoneNumber}>
              <TextInput
                data-testid="phone-number"
                defaultValue={defaultValues?.phoneNumber}
                placeholder="12 345 6789"
                size="lg"
                startAddon={"+64"}
                type={InputType.Tel}
                {...register("phoneNumber")}
              />
            </FormControl>
            <FormControl errorMessage={errors.university?.message} invalid={!!errors.university}>
              <Controller
                control={control}
                defaultValue={defaultValues?.university}
                name="university"
                render={({ field }) => (
                  <Select
                    data-testid="university"
                    icon={<UniversityIcon />}
                    items={universityOptions}
                    label="University"
                    {...field}
                  />
                )}
              />
            </FormControl>
            <FormControl errorMessage={errors.studentId?.message} invalid={!!errors.studentId}>
              <TextInput
                data-testid="student-id"
                defaultValue={defaultValues?.studentId}
                disabled={watch("university") !== University.uoa}
                placeholder="Student ID"
                size="lg"
                startElement={<UserIcon />}
                type={InputType.Number}
                {...register("studentId")}
              />
            </FormControl>
            <FormControl errorMessage={errors.studentUpi?.message} invalid={!!errors.studentUpi}>
              <TextInput
                data-testid="student-upi"
                defaultValue={defaultValues?.studentUpi}
                disabled={watch("university") !== University.uoa}
                placeholder="UPI"
                size="lg"
                startElement={<UserIcon />}
                type={InputType.Text}
                {...register("studentUpi")}
              />
            </FormControl>
            <FormControl errorMessage={errors.gender?.message} invalid={!!errors.gender}>
              <Controller
                control={control}
                defaultValue={defaultValues?.gender}
                name="gender"
                render={({ field }) => (
                  <Select
                    data-testid="gender"
                    icon={<VenusAndMarsIcon />}
                    items={genderOptions}
                    label="Gender"
                    {...field}
                  />
                )}
              />
            </FormControl>
            <FormControl errorMessage={errors.playLevel?.message} invalid={!!errors.playLevel}>
              <Controller
                control={control}
                defaultValue={defaultValues?.playLevel}
                name="playLevel"
                render={({ field }) => (
                  <Select
                    data-testid="skill-level"
                    icon={<IdCardIcon />}
                    items={playLevelOptions}
                    label="Skill level"
                    {...field}
                  />
                )}
              />
            </FormControl>
            <FormControl
              errorMessage={errors.dietaryRequirements?.message}
              invalid={!!errors.dietaryRequirements}
            >
              <TextInput
                data-testid="dietary-requirements"
                defaultValue={defaultValues?.dietaryRequirements}
                placeholder="Dietary requirements"
                size="lg"
                startElement={<BeanOffIcon />}
                type={InputType.Text}
                {...register("dietaryRequirements")}
              />
            </FormControl>
            <FormControl errorMessage={errors.role?.message} invalid={!!errors.role}>
              <Controller
                control={control}
                defaultValue={defaultValues?.role}
                name="role"
                render={({ field }) => (
                  <Select
                    data-testid="role"
                    icon={<IdCardIcon />}
                    items={roleOptions}
                    label="Role"
                    {...field}
                  />
                )}
              />
            </FormControl>
            <FormControl
              errorMessage={errors.remainingSessions?.message}
              invalid={!!errors.remainingSessions}
            >
              <TextInput
                data-testid="remaining-sessions"
                defaultValue={defaultValues?.remainingSessions}
                placeholder="Remaining Sessions"
                size="lg"
                type={InputType.Number}
                {...register("remainingSessions")}
              />
            </FormControl>
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
            leftIcon={<ArrowLeftIcon />}
            onClick={handleClose}
            size="lg"
            w="full"
          >
            Back
          </Button>
          <Button colorScheme="primary" loading={isSubmitting} size="lg" type="submit" w="full">
            Confirm
          </Button>
        </ButtonGroup>
      </DialogFooter>
    </Dialog>
  )
}

CreateMemberPopUp.displayName = "CreateMemberPopUp"
