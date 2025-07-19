import { FormControl } from "@yamada-ui/react"
import type { Path } from "react-hook-form"
import { Input } from "./Input"
import { Preview } from "./Preview"
import type { Field, FormData } from "./types"
import { useUserProfile } from "./UserProfileContext"

/**
 * Props for the FieldGroup component.
 *
 * @template T The tuple of fields for the form.
 * @property field The field definition to render.
 */
export interface FieldGroupProps<T extends readonly Field[]> {
  field: T[number]
}

/**
 * FieldGroup renders a form field with label, error, and appropriate input/preview.
 *
 * @template T The tuple of fields for the form.
 * @param props FieldGroupProps
 */
export const FieldGroup = <T extends readonly Field[]>({ field }: FieldGroupProps<T>) => {
  const { isEditing, form } = useUserProfile<T>()
  const formError = form.formState.errors[field.key as Path<FormData<T>>]

  return (
    <FormControl
      errorMessage={formError?.message as string | undefined}
      invalid={!!formError}
      label={field.label}
      labelProps={{ mb: isEditing ? "3" : "0", color: "muted" }}
    >
      {isEditing ? <Input field={field} /> : <Preview field={field} />}
    </FormControl>
  )
}
