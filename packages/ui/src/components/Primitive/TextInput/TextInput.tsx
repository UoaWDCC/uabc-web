"use client"

import { EyeIcon, EyeOffIcon } from "@yamada-ui/lucide"
import {
  FormControl,
  type FormControlProps,
  IconButton,
  Input,
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
   * The icon to display on the left side of the input field.
   */
  startIcon?: React.ReactNode

  /**
   * The icon to display on the right side of the input field.
   */
  endIcon?: React.ReactNode

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
 * Supported HTML input types for the TextInput component
 * @enum {string}
 */
export enum InputType {
  Text = "text",
  Email = "email",
  Password = "password",
  Number = "number",
  Tel = "tel",
  Url = "url",
  Search = "search",
  Date = "date",
  Time = "time",
  Datetime = "datetime-local",
  Month = "month",
  Week = "week",
}

/**
 * Array of supported input types for easy iteration and Storybook controls
 */
export const INPUT_TYPES = Object.values(InputType)

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
        ...props
      }: TextInputProps,
      ref,
    ) => {
      const isPasswordType = type === InputType.Password
      const [isPasswordVisible, { toggle: togglePasswordVisibility }] = useBoolean(false)

      const inputRef = mergeRefs(registration?.ref ?? null, ref)

      const inputProps = registration
        ? {
            ...registration,
            ...props,
            ref: inputRef,
          }
        : {
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
            <Input
              _focus={{
                borderColor: isError
                  ? ["danger.500", "danger.400"]
                  : ["primary.500", "primary.400"],
                boxShadow: isError
                  ? ["0 0 0 1px $colors.danger.500", "0 0 0 1px $colors.danger.400"]
                  : ["0 0 0 1px $colors.primary.500", "0 0 0 1px $colors.primary.400"],
              }}
              _hover={{
                borderColor: isError ? ["danger.600", "danger.500"] : ["gray.400", "gray.500"],
              }}
              _invalid={{
                borderColor: ["danger.500", "danger.400"],
                _hover: {
                  borderColor: ["danger.600", "danger.500"],
                },
                _focus: {
                  borderColor: ["danger.500", "danger.400"],
                  boxShadow: ["0 0 0 1px $colors.danger.500", "0 0 0 1px $colors.danger.400"],
                },
              }}
              bgGradient="secondaryGradient"
              borderColor={isError ? ["danger.500", "danger.400"] : ["gray.300", "gray.600"]}
              borderRadius="md"
              borderWidth="1px"
              fontSize="md"
              h="10"
              type={isPasswordType ? (isPasswordVisible ? "text" : "password") : type}
              {...inputProps}
            />

            {endIcon ? (
              <InputRightElement>{endIcon}</InputRightElement>
            ) : isPasswordType ? (
              <InputRightElement>
                <IconButton
                  _hover={{
                    color: ["gray.700", "gray.200"],
                  }}
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  color={["gray.500", "gray.400"]}
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
