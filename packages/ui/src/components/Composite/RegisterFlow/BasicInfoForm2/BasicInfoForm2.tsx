"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, InputType, TextInput } from "@repo/ui/components/Primitive"
import { PhoneIcon } from "@yamada-ui/lucide"
import { FormControl, memo, noop, VStack } from "@yamada-ui/react"
import type { FC } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { BasicInfoForm2Schema, type BasicInfoForm2Values } from "../schema"

/**
 * Props for {@link BasicInfoForm2} component
 */
export interface BasicInfoForm2Props {
  /**
   * Submit handler called when user submits the form.
   */
  onSubmit?: SubmitHandler<BasicInfoForm2Values>
}

/**
 * Form component for the second basic info form of the register flow.
 *
 * @remarks No screen responsiveness is implemented in this component; responsiveness between mobile and
 * desktop screens should be implemented in the wrapper components
 *
 * @param props BasicInfoForm2 component props
 * @returns The form component
 */
export const BasicInfoForm2: FC<BasicInfoForm2Props> = memo(({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BasicInfoForm2Values>({
    resolver: zodResolver(BasicInfoForm2Schema),
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
        <Heading.h3>Enter your phone number</Heading.h3>

        <FormControl errorMessage={errors.phoneNumber?.message} invalid={!!errors.phoneNumber}>
          <TextInput
            data-testid="phone-number"
            placeholder="Phone number"
            size="lg"
            startAddon={"+64"}
            type={InputType.Tel}
            {...register("phoneNumber")}
          />
        </FormControl>
      </VStack>
      <Button colorScheme="primary" loading={isSubmitting} type="submit">
        Continue
      </Button>
    </VStack>
  )
})

BasicInfoForm2.displayName = "BasicInfoForm2"
