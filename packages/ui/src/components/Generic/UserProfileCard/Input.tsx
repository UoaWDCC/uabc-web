"use client"

import { InputType, MultiSelect, Select, TextInput } from "@repo/ui/components/Primitive"
import type { SelectItem } from "@yamada-ui/react"
import { Controller, type Path } from "react-hook-form"
import type { Field, FormData } from "./types"
import { useUserProfile } from "./UserProfileContext"

/**
 * Props for the Input component.
 *
 * @template T The tuple of fields for the form.
 * @property field The field definition to render.
 */
export interface InputProps<T extends readonly Field[]> {
  field: T[number]
}

/**
 * Input renders the editable input for a field, depending on its type.
 *
 * @template T The tuple of fields for the form.
 * @param props InputProps
 */
export const Input = <T extends readonly Field[]>({ field }: InputProps<T>) => {
  const { form, isEditing } = useUserProfile<T>()

  if (!isEditing) {
    return null
  }

  const baseProps = {
    variant: "gradient" as const,
    disabled: field.disabled,
    placeholder: field.placeholder,
  }

  if (field.type === "select") {
    return (
      <Controller
        control={form.control}
        name={field.key as Path<FormData<T>>}
        render={({ field: fieldProps }) => (
          <Select
            {...baseProps}
            items={field.items as SelectItem[]}
            {...fieldProps}
            value={fieldProps.value as string}
          />
        )}
        rules={{ required: field.required ? "This field is required" : false }}
      />
    )
  }

  if (field.type === "multiselect") {
    return (
      <Controller
        control={form.control}
        name={field.key as Path<FormData<T>>}
        render={({ field: fieldProps }) => (
          <MultiSelect
            {...baseProps}
            items={field.items as SelectItem[]}
            {...fieldProps}
            value={fieldProps.value as string[]}
          />
        )}
        rules={{ required: field.required ? "This field is required" : false }}
      />
    )
  }

  return (
    <TextInput
      {...baseProps}
      type={field.inputType ?? InputType.Text}
      {...form.register(field.key as Path<FormData<T>>, {
        required: field.required ? "This field is required" : false,
      })}
    />
  )
}
