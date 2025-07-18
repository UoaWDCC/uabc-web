"use client"

import { Gender, PlayLevel } from "@repo/shared"
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
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // throw new Error("Failed to submit form")
    },
  })

  return (
    <UserProfileCard
      onSave={async (data) => {
        await mutation.mutateAsync(data)
      }}
      {...props}
    />
  )
}

const genderOptions = Object.entries(Gender).map(([key, value]) => ({
  value: key,
  label: value,
}))

const playLevelOptions = Object.entries(PlayLevel).map(([key, value]) => ({
  value: key,
  label: value,
}))

export const defaultFields = [
  {
    key: "gender",
    type: "select",
    label: "Gender",
    placeholder: "Enter your gender",
    inputType: InputType.Text,
    required: true,
    items: genderOptions,
  },
  {
    key: "playLevel",
    type: "select",
    label: "Play Level",
    placeholder: "Enter your play level",
    inputType: InputType.Text,
    required: true,
    items: playLevelOptions,
  },
  {
    key: "dietary",
    type: "text",
    label: "Dietary Requirements",
    placeholder: "Enter your dietary requirements",
    inputType: InputType.Text,
  },
] as const

export const defaultValues = {
  gender: Gender.male,
  playLevel: PlayLevel.beginner,
} as const
