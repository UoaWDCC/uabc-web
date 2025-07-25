"use client"

import { Button, Heading } from "@repo/ui/components/Primitive"
import { PenIcon, XIcon } from "@yamada-ui/lucide"
import type { CardProps } from "@yamada-ui/react"
import {
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@yamada-ui/react"
import type { DefaultValues } from "react-hook-form"
import type { ZodTypeAny } from "zod"
import { FieldGroup } from "./FieldGroup"
import type { Field, NullableFormData } from "./types"
import { UserProfileProvider, useUserProfile } from "./UserProfileContext"

/**
 * Props for the UserProfileCard component.
 *
 * @template T The tuple of fields for the form.
 * @property title The card title.
 * @property fields The array of field definitions.
 * @property defaultValues Optional default values for the form.
 * @property onSave Optional callback when the form is saved.
 */
export interface UserProfileCardProps<T extends readonly Field[] = readonly Field[]>
  extends Omit<CardProps, "onSubmit"> {
  title: string
  fields: T
  defaultValues?: Partial<NullableFormData<T>>
  onSave?: (data: NullableFormData<T>) => Promise<void>
  /**
   * Optional Zod schema for form validation.
   */
  schema?: ZodTypeAny
}

/**
 * UserProfileCard renders a user profile form card with edit and view modes.
 *
 * @template T The tuple of fields for the form.
 * @param props UserProfileCardProps
 */
export const UserProfileCard = <T extends readonly Field[]>({
  title,
  fields,
  defaultValues,
  onSave,
  schema,
  ...props
}: UserProfileCardProps<T>) => {
  return (
    <UserProfileProvider
      defaultValues={defaultValues as DefaultValues<NullableFormData<T>>}
      fields={fields}
      onSave={onSave}
      schema={schema}
    >
      <UserProfileContent fields={fields} title={title} {...props} />
    </UserProfileProvider>
  )
}

/**
 * Props for the UserProfileContent component.
 *
 * @template T The tuple of fields for the form.
 * @property title The card title.
 * @property fields The array of field definitions.
 */
interface UserProfileContentProps<T extends readonly Field[]> extends Omit<CardProps, "onSubmit"> {
  title: string
  fields: T
}

/**
 * UserProfileContent renders the main content of the user profile card, including the form and action buttons.
 *
 * @template T The tuple of fields for the form.
 * @param props UserProfileContentProps
 */
const UserProfileContent = <T extends readonly Field[]>({
  title,
  fields,
  ...props
}: UserProfileContentProps<T>) => {
  const { isEditing, startEditing, cancelEditing, saveChanges, form, errorMessage } =
    useUserProfile<T>()

  return (
    <Card
      as="form"
      bg={["secondary.50", "secondary.900"]}
      layerStyle="gradientBorder"
      onSubmit={form.handleSubmit(saveChanges)}
      size="lg"
      w="full"
      {...props}
    >
      <CardHeader>
        <VStack>
          <HStack>
            <Heading.h2 py="4">{title}</Heading.h2>
            <Spacer />
            {!isEditing && (
              <Button minW="12" onClick={startEditing} startIcon={<PenIcon />}>
                Edit
              </Button>
            )}
          </HStack>
          {errorMessage && <Text color={["danger.500", "danger.400"]}>{errorMessage}</Text>}
        </VStack>
      </CardHeader>
      <CardBody>
        {fields.map((field) => (
          <FieldGroup field={field} key={field.key} />
        ))}
      </CardBody>
      {isEditing && (
        <CardFooter>
          <Spacer />
          <ButtonGroup gap="md">
            <Button minW="12" onClick={cancelEditing} startIcon={<XIcon />}>
              Cancel
            </Button>
            <Button
              colorScheme="primary"
              loading={form.formState.isSubmitting}
              minW="12"
              type="submit"
            >
              Save changes
            </Button>
          </ButtonGroup>
        </CardFooter>
      )}
    </Card>
  )
}
