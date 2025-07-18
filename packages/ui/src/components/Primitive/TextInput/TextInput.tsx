"use client"

import { EyeIcon, EyeOffIcon } from "@yamada-ui/lucide"
import {
  IconButton,
  Input,
  type InputAddonProps,
  type InputElementProps,
  InputGroup,
  type InputGroupProps,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
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
   * The element to display on the left side of the input field.
   */
  startElement?: React.ReactNode
  /**
   * The element to display on the right side of the input field.
   */
  endElement?: React.ReactNode
  /**
   * Additional props for the end element.
   */
  endElementProps?: InputElementProps
  /**
   * Additional props for the start element.
   */
  startElementProps?: InputElementProps
  /**
   * The addon to display on the left side of the input field.
   */
  startAddon?: React.ReactNode
  /**
   * Additional props for the start addon.
   */
  startAddonProps?: InputAddonProps
  /**
   * The addon to display on the right side of the input field.
   */
  endAddon?: React.ReactNode
  /**
   * Additional props for the end addon.
   */
  endAddonProps?: InputAddonProps
  /**
   * Additional props for the input group.
   */
  inputGroupProps?: InputGroupProps
}

/**
 * A text input component with built-in password visibility toggle.
 *
 * @param props - Input component properties
 * @returns A memoized, forwarded input component
 */
export const TextInput = memo(
  forwardRef<HTMLInputElement, TextInputProps>(
    (
      {
        type = InputType.Text,
        startElement,
        endElement,
        startAddon,
        endAddon,
        startElementProps,
        endElementProps,
        startAddonProps,
        endAddonProps,
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
          {startElement && (
            <InputLeftElement {...startElementProps}>{startElement}</InputLeftElement>
          )}
          {startAddon && <InputLeftAddon {...startAddonProps}>{startAddon}</InputLeftAddon>}
          <Input
            disabled={disabled}
            ref={ref}
            type={isPasswordType ? (isPasswordVisible ? "text" : "password") : type}
            variant="gradient"
            {...props}
          />
          {endElement ? (
            <InputRightElement {...endElementProps}>{endElement}</InputRightElement>
          ) : isPasswordType ? (
            <InputRightElement clickable={!disabled} {...endElementProps}>
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
          {endAddon && <InputRightAddon {...endAddonProps}>{endAddon}</InputRightAddon>}
        </InputGroup>
      )
    },
  ),
)

TextInput.displayName = "TextInput"
