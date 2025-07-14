"use client"

import {
  FormControl,
  type FormControlProps,
  handlerAll,
  mergeRefs,
  PinInput as UIPinInput,
  type PinInputProps as UIPinInputProps,
} from "@yamada-ui/react"
import { forwardRef, memo } from "react"
import type { FieldPath, FieldValues, UseFormRegisterReturn } from "react-hook-form"
import { PinInputType } from "./types"

/**
 * Props for {@link PinInput}
 *
 * @remarks
 * Extends all the props from {@link UIPinInputProps}.
 * Provides additional customization for pin input fields with automatic React Hook Form integration.
 *
 * @example
 * // Basic usage
 * <PinInput label="Verification Code" length={6} />
 *
 * @example
 * // With React Hook Form
 * <PinInput
 *   label="OTP Code"
 *   length={4}
 *   {...register("otp")}
 *   isError={!!errors.otp}
 *   errorMessage={errors.otp?.message}
 * />
 *
 * @example
 * // Manual error handling
 * <PinInput
 *   label="PIN"
 *   length={4}
 *   type={PinInputType.Number}
 *   isError={true}
 *   errorMessage="Invalid PIN"
 * />
 */
export interface PinInputProps extends Omit<UIPinInputProps, "children"> {
  /**
   * Additional props for the FormControl wrapper.
   *
   * @remarks
   * Allows customization of the FormControl container.
   */
  formControlProps?: FormControlProps
  /**
   * React Hook Form registration object.
   *
   * @remarks
   * When using with React Hook Form, spread the register() result into this prop.
   * This automatically handles onChange, onBlur, name, and ref.
   *
   * @example
   * <PinInput {...register("fieldName")} />
   */
  registration?: UseFormRegisterReturn<FieldPath<FieldValues>>
}

/**
 * A clean, modern pin input component with built-in React Hook Form support.
 *
 * @param props - Pin input component properties
 * @returns A memoized, forwarded pin input component
 */
export const PinInput = memo(
  forwardRef<HTMLDivElement, PinInputProps>(
    (
      { type = PinInputType.Number, formControlProps, registration, ...props }: PinInputProps,
      ref,
    ) => {
      const pinInputRef = mergeRefs(registration?.ref, ref)

      const pinInputProps = {
        variant: "gradient" as const,
        type,
        ...registration,
        ...props,
        ref: pinInputRef,
        onChange: handlerAll(
          props.onChange,
          registration?.onChange
            ? (value: string) => registration.onChange({ target: { value } })
            : undefined,
        ),
      }

      return (
        <FormControl {...formControlProps}>
          <UIPinInput {...pinInputProps} />
        </FormControl>
      )
    },
  ),
)

PinInput.displayName = "PinInput"
