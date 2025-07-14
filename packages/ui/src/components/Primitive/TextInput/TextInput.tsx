"use client"

import { EyeIcon, EyeOffIcon } from "@yamada-ui/lucide"
import {
  FormControl,
  type FormControlProps,
  IconButton,
  Input,
  type InputElementProps,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Label,
  mergeRefs,
  type InputProps as UIInputProps,
  useBoolean,
} from "@yamada-ui/react"
import { forwardRef, memo } from "react"
import type { FieldPath, FieldValues, UseFormRegisterReturn } from "react-hook-form"
import { type AutoCompleteType, InputType } from "./types"

/**
 * Props for {@link TextInput}
 *
 * @remarks
 * Extends all the props from {@link UIInputProps} except `type`.
 * Provides additional customization for input fields with automatic React Hook Form integration.
 *
 * @example
 * // Basic usage
 * <TextInput label="Email" type={InputType.Email} />
 *
 * @example
 * // With React Hook Form
 * <TextInput
 *   label="Password"
 *   type={InputType.Password}
 *   {...register("password")}
 *   isError={!!errors.password}
 *   errorMessage={errors.password?.message}
 * />
 *
 * @example
 * // Manual error handling
 * <TextInput
 *   label="Username"
 *   type={InputType.Text}
 *   isError={true}
 *   errorMessage="Username is required"
 * />
 */
export interface TextInputProps extends Omit<UIInputProps, "type"> {
  /**
   * Label text for the input field.
   *
   * @remarks
   * If not provided, no label will be rendered.
   * The label is rendered above the input field.
   */
  label?: string
  /**
   * The type of the input field.
   *
   * @remarks
   * Supports all standard HTML input types.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types HTML Input Types}
   */
  type?: InputType
  /**
   * The autocomplete attribute for the input field.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete}
   */
  autoComplete?: AutoCompleteType
  /**
   * The icon to display on the left side of the input field.
   */
  startIcon?: React.ReactNode
  /**
   * The icon to display on the right side of the input field.
   */
  endIcon?: React.ReactNode
  /**
   * Additional props for the end icon.
   */
  rightElementProps?: InputElementProps
  /**
   * Indicates whether the input field is in an error state.
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
   * <TextInput {...register("fieldName")} />
   */
  registration?: UseFormRegisterReturn<FieldPath<FieldValues>>
}

/**
 * Array of supported input types for easy iteration and Storybook controls
 */

/**
 * A clean, modern text input component with built-in React Hook Form support.
 *
 * @param props - Input component properties
 * @returns A memoized, forwarded input component
 */
export const TextInput = memo(
  forwardRef<HTMLInputElement, TextInputProps>(
    (
      {
        label,
        type = InputType.Text,
        startIcon,
        endIcon,
        isError = false,
        errorMessage,
        formControlProps,
        registration,
        rightElementProps,
        disabled,
        ...props
      }: TextInputProps,
      ref,
    ) => {
      const isPasswordType = type === InputType.Password
      const [isPasswordVisible, { toggle: togglePasswordVisibility }] = useBoolean(false)

      const inputRef = mergeRefs(registration?.ref ?? null, ref)

      const inputProps = {
        disabled,
        variant: "gradient" as const,
        invalid: isError,
        type: isPasswordType ? (isPasswordVisible ? "text" : "password") : type,
        ...registration,
        ...props,
        ref: inputRef,
      }

      return (
        <FormControl errorMessage={errorMessage} invalid={isError} {...formControlProps}>
          {label && (
            <Label
              color={isError ? ["danger.500", "danger.400"] : ["gray.700", "gray.300"]}
              fontSize="sm"
            >
              {label}
            </Label>
          )}

          <InputGroup>
            {startIcon && <InputLeftElement>{startIcon}</InputLeftElement>}
            <Input {...inputProps} />

            {endIcon ? (
              <InputRightElement {...rightElementProps}>{endIcon}</InputRightElement>
            ) : isPasswordType ? (
              <InputRightElement clickable={!disabled} {...rightElementProps}>
                <IconButton
                  _hover={{
                    color: ["gray.700", "gray.200"],
                  }}
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  color={["gray.500", "gray.400"]}
                  disabled={disabled}
                  icon={isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  onClick={togglePasswordVisibility}
                  size="sm"
                  variant="ghost"
                />
              </InputRightElement>
            ) : null}
          </InputGroup>
        </FormControl>
      )
    },
  ),
)

TextInput.displayName = "TextInput"
