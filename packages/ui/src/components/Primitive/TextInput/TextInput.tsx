"use client"

import { EyeIcon, EyeOffIcon } from "@yamada-ui/lucide"
import {
  IconButton,
  Input,
  type InputElementProps,
  InputGroup,
  type InputGroupProps,
  InputLeftElement,
  InputRightElement,
  type InputProps as UIInputProps,
  useBoolean,
} from "@yamada-ui/react"
import { forwardRef, memo } from "react"
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
 * <TextInput type={InputType.Email} />
 *
 * // With React Hook Form
 * <TextInput type={InputType.Password} {...register("password")} />
 */
export interface TextInputProps extends Omit<UIInputProps, "type"> {
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
   * Additional props for the input group.
   */
  inputGroupProps?: InputGroupProps
}

/**
 * A clean, modern text input primitive with built-in React Hook Form support.
 *
 * @param props - Input component properties
 * @returns A memoized, forwarded input component
 */
export const TextInput = memo(
  forwardRef<HTMLInputElement, TextInputProps>(
    (
      {
        type = InputType.Text,
        startIcon,
        endIcon,
        rightElementProps,
        disabled,
        inputGroupProps,
        ...props
      }: TextInputProps,
      ref,
    ) => {
      const isPasswordType = type === InputType.Password
      const [isPasswordVisible, { toggle: togglePasswordVisibility }] = useBoolean(false)

      return (
        <InputGroup {...inputGroupProps}>
          {startIcon && <InputLeftElement>{startIcon}</InputLeftElement>}
          <Input
            disabled={disabled}
            ref={ref}
            type={isPasswordType ? (isPasswordVisible ? "text" : "password") : type}
            variant="gradient"
            {...props}
          />

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
      )
    },
  ),
)

TextInput.displayName = "TextInput"
