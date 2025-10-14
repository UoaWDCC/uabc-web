"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  AdditionalInfoFormSchema,
  type AdditionalInfoFormValues,
  GenderOptions,
  PlayLevelOptions,
} from "@repo/shared"
import { Button, Heading, InputType, Select, TextInput } from "@repo/ui/components/Primitive"
import { BeanOffIcon, IdCardIcon, VenusAndMarsIcon } from "@yamada-ui/lucide"
import { FormControl, memo, noop, VStack } from "@yamada-ui/react"
import type { FC } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"

/**
 * Props for {@link AdditionalInfoForm} component
 */
export interface AdditionalInfoFormProps {
  /**
   * Default values to pre-fill the form.
   */
  defaultValues?: AdditionalInfoFormValues
  /**
   * Submit handler called when user submits the form.
   */
  onSubmit?: SubmitHandler<AdditionalInfoFormValues>
}

/**
 * Form component for the additional info form of the register flow.
 *
 * @remarks No screen responsiveness is implemented in this component; responsiveness between mobile and
 * desktop screens should be implemented in the wrapper components
 *
 * @param props AdditionalInfoForm component props
 * @returns The form component
 */
export const AdditionalInfoForm: FC<AdditionalInfoFormProps> = memo(
  ({ defaultValues, onSubmit }) => {
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
              defaultValue={defaultValues?.gender}
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
          <FormControl errorMessage={errors.playLevel?.message} invalid={!!errors.playLevel}>
            <Controller
              control={control}
              defaultValue={defaultValues?.playLevel}
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
        </VStack>
        <Button colorScheme="primary" loading={isSubmitting} type="submit">
          Continue
        </Button>
      </VStack>
    )
  },
)

AdditionalInfoForm.displayName = "AdditionalInfoForm"
