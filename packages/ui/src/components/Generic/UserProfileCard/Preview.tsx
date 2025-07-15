import { TextInput } from "@repo/ui/components/Primitive"
import type { SelectItem } from "@yamada-ui/react"
import type { Path } from "react-hook-form"
import type { Field, FormData } from "./types"
import { useUserProfile } from "./UserProfileContext"
import { getDisplayValue } from "./utils"

/**
 * Props for the Preview component.
 *
 * @template T The tuple of fields for the form.
 * @property field The field definition to render.
 */
export interface PreviewProps<T extends readonly Field[]> {
  field: T[number]
}

/**
 * Preview renders a read-only view of a field's value.
 *
 * @template T The tuple of fields for the form.
 * @param props PreviewProps
 */
export const Preview = <T extends readonly Field[]>({ field }: PreviewProps<T>) => {
  const { form, isEditing } = useUserProfile<T>()
  const value = form.watch(field.key as Path<FormData<T>>)

  if (isEditing) {
    return null
  }

  if (field.type === "select") {
    return (
      <TextInput
        disabled={field.disabled}
        placeholder={field.placeholder}
        readOnly
        value={getDisplayValue(field.items as SelectItem[], value as string)}
        variant="flushed"
      />
    )
  }

  if (field.type === "multiselect") {
    return (
      <TextInput
        disabled={field.disabled}
        placeholder={field.placeholder}
        readOnly
        value={getDisplayValue(field.items as SelectItem[], value as string[])}
        variant="flushed"
      />
    )
  }

  return (
    <TextInput
      disabled={field.disabled}
      placeholder={field.placeholder}
      readOnly
      value={value as string}
      variant="flushed"
    />
  )
}
