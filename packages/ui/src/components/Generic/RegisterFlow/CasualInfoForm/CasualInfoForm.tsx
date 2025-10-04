"use client"

import type { CasualInfoFormValues, OnboardingGlobal } from "@repo/shared/types"
import { RichText, type RichTextProps } from "@repo/ui/components/Generic/RichText"
import { Button, Heading } from "@repo/ui/components/Primitive"
import { UserRoundIcon } from "@yamada-ui/lucide"
import {
  Card,
  CardBody,
  CardFooter,
  Center,
  Checkbox,
  FormControl,
  memo,
  noop,
  VStack,
} from "@yamada-ui/react"
import type { FC } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"

/**
 * Props for {@link CasualInfoForm} component
 */
export interface CasualInfoFormProps {
  /**
   * Default values to pre-fill the form.
   */
  defaultValues?: CasualInfoFormValues
  /**
   * Submit handler called when user submits the form.
   */
  onSubmit?: SubmitHandler<CasualInfoFormValues>
  /**
   *
   */
  casualMemberInformation: OnboardingGlobal["casualMemberInformation"]
  /**
   *
   */
  richTextProps?: Omit<RichTextProps, "data">
}

/**
 * Form component for casual member information confirmation in the register flow.
 *
 * @remarks No screen responsiveness is implemented in this component; responsiveness between mobile and
 * desktop screens should be implemented in the wrapper components
 *
 * @param props CasualInfoForm component props
 * @returns The form component
 */
export const CasualInfoForm: FC<CasualInfoFormProps> = memo(
  ({ defaultValues, onSubmit, casualMemberInformation, richTextProps }) => {
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<CasualInfoFormValues>()

    return (
      <VStack
        as="form"
        bgColor="inherit"
        h="full"
        justifyContent="space-between"
        onSubmit={handleSubmit(onSubmit ?? noop)}
      >
        <VStack>
          <Center>
            <UserRoundIcon fontSize="9xl" />
          </Center>

          <Heading.h3 textAlign="center">Casual member information</Heading.h3>

          <Card bgColor="secondary" borderRadius="xl" layerStyle="gradientBorder">
            <CardBody>
              <RichText data={casualMemberInformation} {...richTextProps} />
            </CardBody>
            <CardFooter>
              <FormControl errorMessage={errors.agree?.message} invalid={!!errors.agree}>
                <Controller
                  control={control}
                  defaultValue={defaultValues?.agree}
                  name="agree"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Checkbox
                      checked={value}
                      data-testid="agree"
                      label="I agree"
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )}
                  rules={{ required: { value: true, message: "Please agree to continue" } }}
                />
              </FormControl>
            </CardFooter>
          </Card>
        </VStack>
        <Button colorScheme="primary" loading={isSubmitting} type="submit">
          Continue
        </Button>
      </VStack>
    )
  },
)

CasualInfoForm.displayName = "CasualInfoForm"
