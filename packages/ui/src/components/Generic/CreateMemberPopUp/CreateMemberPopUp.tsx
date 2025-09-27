import { zodResolver } from "@hookform/resolvers/zod"
import {
  CreateMemberPopUpFormDataSchema,
  type CreateMemberPopUpFormValues,
  GenderOptions,
  PlayLevelOptions,
  RoleOptions,
  University,
  UniversityOptions,
} from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { Button, Heading, Select, TextInput } from "@repo/ui/components/Primitive"
import { AutoCompleteType, InputType } from "@repo/ui/components/Primitive/TextInput/types"
import {
  ArrowLeftIcon,
  BeanOffIcon,
  FolderPenIcon,
  IdCardIcon,
  MailIcon,
  TicketsIcon,
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
  Grid,
  GridItem,
  VStack,
} from "@yamada-ui/react"
import type { FC } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"

export interface CreateMemberPopUpProps extends DialogProps {
  /**
   * The title to display in the dialog header.
   */
  title?: string

  /**
   * Default values to pre-fill the form.
   */
  userToEdit?: User | null

  /**
   * The function to call when the form is submitted.
   */
  onConfirm?: (data: CreateMemberPopUpFormValues) => void
}

/**
 * Dialog component for creating or editing a user - expected for admin use only.
 *
 * @param props CreateMemberPopUp component properties
 * @returns A modal dialog with title and input fields (pre-filled if default values given)
 *
 * @example
 /**
  * Example usage:
  * 
  * <CreateMemberPopUp
  *   userToEdit={userToEdit}
  *   key={selectedUser?.id}
  *   onClose={() => {
  *     onCloseEdit()
  *   }}
  *   onConfirm={(values) => handleEditConfirm(values)}
  *   open={openEdit}
  * />
  */
export const CreateMemberPopUp: FC<CreateMemberPopUpProps> = ({
  title = "Create New Member",
  userToEdit,
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
  } = useForm<CreateMemberPopUpFormValues>({
    resolver: zodResolver(CreateMemberPopUpFormDataSchema),
  })

  const handleClose = () => {
    reset()
    props.onClose?.()
  }

  const onSubmit: SubmitHandler<CreateMemberPopUpFormValues> = (data) => {
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
                <FormControl errorMessage={errors.firstName?.message} invalid={!!errors.firstName}>
                  <TextInput
                    data-testid="first-name"
                    defaultValue={userToEdit?.firstName}
                    placeholder="First name"
                    size="lg"
                    startElement={<FolderPenIcon />}
                    type={InputType.Text}
                    {...register("firstName")}
                  />
                </FormControl>
                <FormControl errorMessage={errors.email?.message} invalid={!!errors.email}>
                  <TextInput
                    autoComplete={AutoCompleteType.Email}
                    data-testid="email"
                    defaultValue={userToEdit?.email}
                    placeholder="Email Address"
                    startElement={<MailIcon />}
                    type={InputType.Email}
                    {...register("email")}
                  />
                </FormControl>
                <FormControl
                  errorMessage={errors.university?.message}
                  invalid={!!errors.university}
                >
                  <Controller
                    control={control}
                    defaultValue={userToEdit?.university ?? undefined}
                    name="university"
                    render={({ field }) => (
                      <Select
                        data-testid="university"
                        icon={<UniversityIcon />}
                        items={UniversityOptions}
                        label="University"
                        {...field}
                      />
                    )}
                  />
                </FormControl>
                <FormControl
                  errorMessage={errors.studentUpi?.message}
                  invalid={!!errors.studentUpi}
                >
                  <TextInput
                    data-testid="student-upi"
                    defaultValue={userToEdit?.studentUpi ?? undefined}
                    disabled={watch("university") !== University.uoa}
                    placeholder="UPI"
                    size="lg"
                    startElement={<UserIcon />}
                    type={InputType.Text}
                    {...register("studentUpi")}
                  />
                </FormControl>
                <FormControl errorMessage={errors.playLevel?.message} invalid={!!errors.playLevel}>
                  <Controller
                    control={control}
                    defaultValue={userToEdit?.playLevel ?? undefined}
                    name="playLevel"
                    render={({ field }) => (
                      <Select
                        data-testid="skill-level"
                        icon={<IdCardIcon />}
                        items={PlayLevelOptions}
                        label="Skill level"
                        {...field}
                      />
                    )}
                  />
                </FormControl>
                <FormControl errorMessage={errors.role?.message} invalid={!!errors.role}>
                  <Controller
                    control={control}
                    defaultValue={userToEdit?.role}
                    name="role"
                    render={({ field }) => (
                      <Select
                        data-testid="role"
                        icon={<IdCardIcon />}
                        items={RoleOptions}
                        label="Role"
                        {...field}
                      />
                    )}
                  />
                </FormControl>
              </GridItem>
              <GridItem as={VStack} gap="md">
                <FormControl errorMessage={errors.lastName?.message} invalid={!!errors.lastName}>
                  <TextInput
                    data-testid="last-name"
                    defaultValue={userToEdit?.lastName ?? undefined}
                    placeholder="Last name"
                    size="lg"
                    startElement={<FolderPenIcon />}
                    type={InputType.Text}
                    {...register("lastName")}
                  />
                </FormControl>
                <FormControl
                  errorMessage={errors.phoneNumber?.message}
                  invalid={!!errors.phoneNumber}
                >
                  <TextInput
                    data-testid="phone-number"
                    defaultValue={userToEdit?.phoneNumber ?? undefined}
                    placeholder="12 345 6789"
                    size="lg"
                    startAddon="+64"
                    type={InputType.Tel}
                    {...register("phoneNumber")}
                  />
                </FormControl>
                <FormControl errorMessage={errors.studentId?.message} invalid={!!errors.studentId}>
                  <TextInput
                    data-testid="student-id"
                    defaultValue={userToEdit?.studentId ?? undefined}
                    disabled={watch("university") !== University.uoa}
                    placeholder="Student ID"
                    size="lg"
                    startElement={<UserIcon />}
                    type={InputType.Number}
                    {...register("studentId")}
                  />
                </FormControl>
                <FormControl errorMessage={errors.gender?.message} invalid={!!errors.gender}>
                  <Controller
                    control={control}
                    defaultValue={userToEdit?.gender ?? undefined}
                    name="gender"
                    render={({ field }) => (
                      <Select
                        data-testid="gender"
                        icon={<VenusAndMarsIcon />}
                        items={GenderOptions}
                        label="Gender"
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
                    defaultValue={userToEdit?.dietaryRequirements ?? undefined}
                    placeholder="Dietary requirements"
                    size="lg"
                    startElement={<BeanOffIcon />}
                    type={InputType.Text}
                    {...register("dietaryRequirements")}
                  />
                </FormControl>
                <FormControl
                  errorMessage={errors.remainingSessions?.message}
                  invalid={!!errors.remainingSessions}
                >
                  <TextInput
                    data-testid="remaining-sessions"
                    defaultValue={userToEdit?.remainingSessions ?? 0}
                    placeholder="Remaining Sessions"
                    size="lg"
                    startElement={<TicketsIcon />}
                    type={InputType.Number}
                    {...register("remainingSessions")}
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
            leftIcon={<ArrowLeftIcon />}
            onClick={handleClose}
            size="lg"
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

CreateMemberPopUp.displayName = "CreateMemberPopUp"
