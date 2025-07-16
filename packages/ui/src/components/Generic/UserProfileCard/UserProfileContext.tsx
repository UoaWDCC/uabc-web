"use client"
import { useBoolean } from "@yamada-ui/react"
import { createContext, type ReactNode, useContext, useState } from "react"
import { type DefaultValues, type UseFormReturn, useForm } from "react-hook-form"
import type { Field, FormData, NullableFormData } from "./types"

/**
 * Context value for user profile editing state and form.
 *
 * @template T The tuple of fields for the form.
 * @property isEditing Whether the form is in editing mode.
 * @property form The react-hook-form instance for the form.
 * @property startEditing Function to start editing mode.
 * @property cancelEditing Function to cancel editing and reset the form.
 * @property saveChanges Function to save changes and exit editing mode.
 * @property error Error message to display.
 */
export interface UserProfileContextValue<T extends readonly Field[]> {
  isEditing: boolean
  form: UseFormReturn<FormData<T>>
  startEditing: () => void
  cancelEditing: () => void
  saveChanges: (data: FormData<T>) => Promise<void>
  errorMessage?: string | null
}

const UserProfileContext = createContext<unknown>(null)

/**
 * Hook to access user profile context. Must be used within UserProfileProvider.
 *
 * @template T The tuple of fields for the form.
 * @returns The user profile context value.
 * @throws If used outside of UserProfileProvider.
 */
export const useUserProfile = <T extends readonly Field[]>() => {
  const context = useContext(UserProfileContext) as UserProfileContextValue<T> | null
  if (!context) {
    throw new Error("useUserProfile must be used within UserProfileProvider")
  }
  return context
}

/**
 * Props for the UserProfileProvider component.
 *
 * @template T The tuple of fields for the form.
 * @property children The child nodes to render within the provider.
 * @property fields The array of field definitions.
 * @property defaultValues Optional default values for the form.
 * @property onSave Optional callback when the form is saved.
 */
export interface UserProfileProviderProps<T extends readonly Field[]> {
  children: ReactNode
  fields: T
  defaultValues?: DefaultValues<NullableFormData<T>>
  onSave?: (data: NullableFormData<T>) => Promise<void>
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * Provides user profile context for editing and form state.
 *
 * @template T The tuple of fields for the form.
 * @param props UserProfileProviderProps
 * @returns The provider component.
 */
export const UserProfileProvider = <T extends readonly Field[]>({
  children,
  defaultValues,
  onSave,
  onSuccess,
  onCancel,
}: UserProfileProviderProps<T>) => {
  const [isEditing, { on: startEditing, off: stopEditing }] = useBoolean()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const form = useForm<NullableFormData<T>>({ defaultValues })

  const cancelEditing = () => {
    form.reset()
    stopEditing()
    setErrorMessage(null)
    onCancel?.()
  }

  const saveChanges = async (data: FormData<T>) => {
    try {
      await onSave?.(data)
      setErrorMessage(null)
      stopEditing()
      onSuccess?.()
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <UserProfileContext.Provider
      value={{
        isEditing,
        form,
        startEditing,
        cancelEditing,
        saveChanges,
        errorMessage,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}
