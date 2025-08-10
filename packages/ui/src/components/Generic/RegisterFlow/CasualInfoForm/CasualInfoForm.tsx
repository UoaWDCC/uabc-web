"use client"

import type { CasualInfoFormValues } from "@repo/shared"
import { Button, Heading } from "@repo/ui/components/Primitive"
import { UserRoundIcon } from "@yamada-ui/lucide"

import {
  Card,
  CardBody,
  CardFooter,
  Center,
  Checkbox,
  DecimalList,
  For,
  FormControl,
  ListItem,
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
export const CasualInfoForm: FC<CasualInfoFormProps> = memo(({ defaultValues, onSubmit }) => {
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
            <DecimalList>
              <For
                each={[
                  "Casual members can only attend 1 session a week.",
                  "It is $8 per session and is to be paid before attending to secure your spot. We will send you an email for this, please do not pay unless we reach out to you.",
                  "We aim to prioritize members over casuals!",
                  "The number of casuals allowed per session may vary dependent on capacity.",
                ]}
              >
                {(text, index) => (
                  <ListItem key={index} textWrap="wrap">
                    {text}
                  </ListItem>
                )}
              </For>
            </DecimalList>
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
})

CasualInfoForm.displayName = "CasualInfoForm"
