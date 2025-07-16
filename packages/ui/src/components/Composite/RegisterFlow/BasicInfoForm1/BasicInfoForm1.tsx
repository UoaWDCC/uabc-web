"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, InputType, TextInput } from "@repo/ui/components/Primitive"
import { FolderPenIcon } from "@yamada-ui/lucide"
import { FormControl, memo, noop, VStack } from "@yamada-ui/react"
import type { FC } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { BasicInfoForm1Schema, type BasicInfoForm1Values } from "../schema"

/**
 * Props for {@link BasicInfoForm1} component
 */
export interface BasicInfoForm1Props {
  /**
   * Submit handler called when user submits the form.
   */
  onSubmit?: SubmitHandler<BasicInfoForm1Values>
}

/**
 * Form component for the first basic info form of the register flow.
 *
 * @remarks No screen responsivity is implemented in this component; responsivity between mobile and
 * desktop screens should be implemented in the wrapper components
 *
 * @param props BasicInfoForm1 component props
 * @returns The form component
 */
export const BasicInfoForm1: FC<BasicInfoForm1Props> = memo(({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BasicInfoForm1Values>({
    resolver: zodResolver(BasicInfoForm1Schema),
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
        <Heading.h3>Enter your name</Heading.h3>

        <FormControl errorMessage={errors.firstName?.message} invalid={!!errors.firstName}>
          <TextInput
            data-testid="first-name"
            placeholder="First name"
            startIcon={<FolderPenIcon />}
            type={InputType.Text}
            {...register("firstName")}
          />
        </FormControl>
        <FormControl errorMessage={errors.lastName?.message} invalid={!!errors.lastName}>
          <TextInput
            data-testid="last-name"
            placeholder="Lastname"
            startIcon={<FolderPenIcon />}
            type={InputType.Text}
            {...register("lastName")}
          />
        </FormControl>
      </VStack>
      <Button colorScheme="primary" loading={isSubmitting} type="submit">
        Continue
      </Button>
    </VStack>
  )
})

BasicInfoForm1.displayName = "BasicInfoForm1"
