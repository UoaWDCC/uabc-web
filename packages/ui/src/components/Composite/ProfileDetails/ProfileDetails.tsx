"use client"

import { ProfileDetailsSchema } from "@repo/shared"
import { casualUserMock } from "@repo/shared/mocks"
import type { Field, NullableFormData } from "@repo/ui/components/Generic"
import { UserProfileCard, type UserProfileCardProps } from "@repo/ui/components/Generic"
import { InputType } from "@repo/ui/components/Primitive"
import { useMutation } from "@tanstack/react-query"

/**
 * The props for the ProfileDetails component.
 * @template T The tuple of fields for the form.
 */
export interface ProfileDetailsProps<T extends readonly Field[]> extends UserProfileCardProps<T> {}

/**
 * ProfileDetails renders a user profile details card with asynchronous save handling.
 *
 * @template T The tuple of fields for the form.
 * @param props ProfileDetailsProps
 */
export const ProfileDetails = <T extends readonly Field[]>({
  onSave,
  ...props
}: ProfileDetailsProps<T>) => {
  const mutation = useMutation({
    mutationFn: async (data: NullableFormData<T>) => {
      await onSave?.(data)
    },
  })

  return (
    <UserProfileCard
      onSave={async (data) => {
        await mutation.mutateAsync(data)
      }}
      schema={ProfileDetailsSchema}
      {...props}
    />
  )
}

export const defaultFields = [
  {
    key: "firstName",
    type: "text",
    label: "First Name",
    placeholder: "Enter your first name",
    inputType: InputType.Text,
    required: true,
  },
  {
    key: "lastName",
    type: "text",
    label: "Last Name",
    placeholder: "Enter your last name",
    inputType: InputType.Text,
  },
  {
    key: "email",
    type: "text",
    label: "Email Address",
    placeholder: "Enter your email",
    inputType: InputType.Email,
    required: true,
    disabled: true,
  },
  {
    key: "phoneNumber",
    type: "text",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    inputType: InputType.Tel,
  },
] as const

export const defaultValues = {
  firstName: casualUserMock.firstName,
  lastName: casualUserMock.lastName,
  email: casualUserMock.email,
  phoneNumber: casualUserMock.phoneNumber,
}
