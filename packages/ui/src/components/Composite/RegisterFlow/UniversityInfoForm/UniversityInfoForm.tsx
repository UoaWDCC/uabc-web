"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { University } from "@repo/shared"
import { Button, Heading, InputType, Select, TextInput } from "@repo/ui/components/Primitive"
import { UniversityIcon, UserIcon } from "@yamada-ui/lucide"
import { FormControl, memo, noop, VStack } from "@yamada-ui/react"
import type { FC } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { UniversityInfoFormSchema, type UniversityInfoFormValues } from "../schema"

/**
 * Props for {@link UniversityInfoForm} component
 */
export interface UniversityInfoFormProps {
  /**
   * Submit handler called when user submits the form.
   */
  onSubmit?: SubmitHandler<UniversityInfoFormValues>
}

/**
 * Options for the University Select component, using enum values from {@link University}.
 */
const universityOptions = Object.values(University).map((value) => ({
  value: value,
  label: value,
}))

/**
 * Form component for the university info form of the register flow.
 *
 * @remarks No screen responsiveness is implemented in this component; responsiveness between mobile and
 * desktop screens should be implemented in the wrapper components
 *
 * @param props UniversityInfoForm component props
 * @returns The form component
 */
export const UniversityInfoForm: FC<UniversityInfoFormProps> = memo(({ onSubmit }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<UniversityInfoFormValues>({
    resolver: zodResolver(UniversityInfoFormSchema),
  })

  return (
    <VStack
      as="form"
      bgColor="inherit"
      h="full"
      justifyContent="space-between"
      onSubmit={handleSubmit(onSubmit ?? noop)}
    >
      <VStack>
        <Heading.h3>Enter your university details</Heading.h3>
        <FormControl errorMessage={errors.university?.message} invalid={!!errors.university}>
          <Controller
            control={control}
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
            disabled={watch("university") !== University.uoa}
            placeholder="UPI"
            size="lg"
            startElement={<UserIcon />}
            type={InputType.Text}
            {...register("studentUpi")}
          />
        </FormControl>
      </VStack>
      <Button colorScheme="primary" loading={isSubmitting} type="submit">
        Continue
      </Button>
    </VStack>
  )
})

UniversityInfoForm.displayName = "UniversityInfoForm"
