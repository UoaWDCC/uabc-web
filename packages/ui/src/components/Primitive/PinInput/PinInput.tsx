"use client"

import {
  FormControl,
  type FormControlProps,
  handlerAll,
  Label,
  type LabelProps,
  mergeRefs,
  PinInput as UIPinInput,
  type PinInputProps as UIPinInputProps,
} from "@yamada-ui/react"
import { forwardRef, memo } from "react"
import type { FieldPath, FieldValues, UseFormRegisterReturn } from "react-hook-form"
import { PinInputSize, PinInputType, PinInputVariant } from "./types"

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
   * Label text for the pin input field.
   *
   * @remarks
   * If not provided, no label will be rendered.
   * The label is rendered above the pin input field.
   */
  label?: string

  /**
   * Additional props for the Label component.
   *
   * @remarks
   * Allows customization of the Label component styling and behavior.
   */
  labelProps?: LabelProps

  /**
   * The type of the pin input field.
   *
   * @remarks
   * Supports number and alphanumeric input types.
   *
   * @defaultValue `PinInputType.Number`
   */
  type?: PinInputType

  /**
   * The size of the pin input field.
   *
   * @defaultValue `PinInputSize.MD`
   */
  size?: PinInputSize

  /**
   * The variant of the pin input field.
   *
   * @defaultValue `PinInputVariant.Outline`
   */
  variant?: PinInputVariant

  /**
   * Indicates whether the pin input field is in an error state.
   *
   * @remarks
   * When `true`, the input displays an error border and error message.
   * Works seamlessly with React Hook Form validation.
   *
   * @defaultValue `false`
   */
  isError?: boolean

  /**
   * The error message displayed when the input is in an error state.
   *
   * @remarks
   * If not provided, no error message will be shown.
   * Typically used with React Hook Form error messages.
   */
  errorMessage?: string

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
      {
        label,
        labelProps,
        type = PinInputType.Number,
        size = PinInputSize.MD,
        variant = PinInputVariant.Outline,
        isError = false,
        errorMessage,
        formControlProps,
        registration,
        placeholder = "○",
        ...props
      }: PinInputProps,
      ref,
    ) => {
      const pinInputRef = mergeRefs(registration?.ref, ref)

      const pinInputProps = {
        ...registration,
        ...props,
        ref: pinInputRef,
        type,
        size,
        variant,
        placeholder,
        onChange: handlerAll(
          props.onChange,
          registration?.onChange
            ? (value: string) => registration.onChange({ target: { value } })
            : undefined,
        ),
      }

      return (
        <FormControl errorMessage={errorMessage} invalid={isError} {...formControlProps}>
          {label && (
            <Label
              color={isError ? ["danger.500", "danger.400"] : ["gray.700", "gray.300"]}
              fontSize="sm"
              {...labelProps}
            >
              {label}
            </Label>
          )}

          <UIPinInput invalid={isError} {...pinInputProps} />
        </FormControl>
      )
    },
  ),
)

PinInput.displayName = "PinInput"
