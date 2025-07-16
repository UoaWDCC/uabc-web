"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Gender, PlayLevel } from "@repo/shared"
import { Button, Heading, InputType, Select, TextInput } from "@repo/ui/components/Primitive"
import { BeanOffIcon, IdCardIcon, VenusAndMarsIcon } from "@yamada-ui/lucide"
import { FormControl, memo, noop, VStack } from "@yamada-ui/react"
import type { FC } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { AdditionalInfoFormSchema, type AdditionalInfoFormValues } from "../schema"

/**
 * Props for {@link AdditionalInfoForm} component
 */
export interface AdditionalInfoFormProps {
  /**
   * Submit handler called when user submits the form.
   */
  onSubmit?: SubmitHandler<AdditionalInfoFormValues>
}

/**
 * Options for the Gender Select component, using enum values from {@link Gender}.
 */
const genderOptions = Object.values(Gender).map((value) => ({
  value: value,
  label: value,
}))

/**
 * Options for the Skill Level Select component, using enum values from {@link PlayLevel}.
 */
const skillLevelOptions = Object.values(PlayLevel).map((playLevel) => ({
  value: playLevel,
  label: playLevel,
}))

/**
 * Form component for the additional info form of the register flow.
 *
 * @remarks No screen responsiveness is implemented in this component; responsiveness between mobile and
 * desktop screens should be implemented in the wrapper components
 *
 * @param props AdditionalInfoForm component props
 * @returns The form component
 */
export const AdditionalInfoForm: FC<AdditionalInfoFormProps> = memo(({ onSubmit }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdditionalInfoFormValues>({
    resolver: zodResolver(AdditionalInfoFormSchema),
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
        <Heading.h3>Enter additional information</Heading.h3>
        <FormControl errorMessage={errors.gender?.message} invalid={!!errors.gender}>
          <Controller
            control={control}
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
        <FormControl errorMessage={errors.skillLevel?.message} invalid={!!errors.skillLevel}>
          <Controller
            control={control}
            name="skillLevel"
            render={({ field }) => (
              <Select
                data-testid="skill-level"
                icon={<IdCardIcon />}
                items={skillLevelOptions}
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
            placeholder="Dietary requirements"
            size="lg"
            startIcon={<BeanOffIcon />}
            type={InputType.Text}
            {...register("dietaryRequirements")}
          />
        </FormControl>
      </VStack>
      <Button colorScheme="primary" loading={isSubmitting} type="submit">
        Continue
      </Button>
    </VStack>
  )
})

AdditionalInfoForm.displayName = "AdditionalInfoForm"
