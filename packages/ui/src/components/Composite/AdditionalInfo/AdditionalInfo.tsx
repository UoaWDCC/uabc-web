"use client"

import { AdditionalInfoSchema, Gender, PlayLevel } from "@repo/shared"
import { casualUserMock } from "@repo/shared/mocks"
import type { Field, NullableFormData } from "@repo/ui/components/Generic"
import { UserProfileCard, type UserProfileCardProps } from "@repo/ui/components/Generic"
import { InputType } from "@repo/ui/components/Primitive"
import { useMutation } from "@tanstack/react-query"

/**
 * The props for the AdditionalInfo component.
 * @template T The tuple of fields for the form.
 */
export interface AdditionalInfoProps<T extends readonly Field[]> extends UserProfileCardProps<T> {}

/**
 * AdditionalInfo renders a user additional info card with asynchronous save handling.
 *
 * @template T The tuple of fields for the form.
 * @param props AdditionalInfoProps
 */
export const AdditionalInfo = <T extends readonly Field[]>({
  onSave,
  ...props
}: AdditionalInfoProps<T>) => {
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
      schema={AdditionalInfoSchema}
      {...props}
    />
  )
}

const genderOptions = Object.values(Gender).map((value) => ({
  value,
  label: value,
}))

const playLevelOptions = Object.values(PlayLevel).map((value) => ({
  value,
  label: value,
}))

export const defaultFields = [
  {
    key: "gender",
    type: "select",
    label: "Gender",
    placeholder: "Enter your gender",
    inputType: InputType.Text,
    items: genderOptions,
  },
  {
    key: "playLevel",
    type: "select",
    label: "Play Level",
    placeholder: "Enter your play level",
    inputType: InputType.Text,
    items: playLevelOptions,
  },
  {
    key: "dietaryRequirements",
    type: "text",
    label: "Dietary Requirements",
    placeholder: "Enter your dietary requirements",
    inputType: InputType.Text,
  },
] as const

export const defaultValues = {
  gender: casualUserMock.gender,
  playLevel: casualUserMock.playLevel,
  dietaryRequirements: casualUserMock.dietaryRequirements,
} as const
