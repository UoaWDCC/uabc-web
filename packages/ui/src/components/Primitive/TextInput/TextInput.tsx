"use client"

import { EyeIcon, EyeOffIcon } from "@yamada-ui/lucide"
import {
  type CSSUIObject,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Label,
  type LabelProps,
  type InputProps as UIInputProps,
  useBoolean,
} from "@yamada-ui/react"
import { forwardRef, memo } from "react"

/**
 * Props for {@link TextInput}
 *
 * @remarks
 * Extends all the props from {@link UIInputProps} except `type`.
 * Provides additional customization for input fields with dynamic label behavior.
 *
 * @example
 * // Basic usage
 * <TextInput label="Email" type={InputType.Email} />
 *
 * @example
 * // With error handling
 * <TextInput
 *   label="Password"
 *   type={InputType.Password}
 *   isError={true}
 *   errorMessage="Invalid password"
 * />
 */
export interface InputProps extends Omit<UIInputProps, "type"> {
  /**
   * Label text of the input field.
   *
   * @remarks
   * If not provided, an empty string is used.
   * The label dynamically adjusts based on input state.
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
   * Indicates whether the input field is in an error state.
   *
   * @remarks
   * When `true`, the input displays an error border and error message.
   *
   * @defaultValue `false`
   */
  isError?: boolean

  /**
   * The error message displayed when the input is in an error state.
   *
   * @remarks
   * If not provided, no error message will be shown.
   */
  errorMessage?: string

  /**
   * Custom CSS for the label when the input field is not focused and has no value.
   *
   * @remarks
   * Allows fine-tuning of label appearance in the placeholder state.
   */
  placeholderShownLabelCSS?: CSSUIObject

  /**
   * Custom CSS for the label when the input field is not focused and has a value.
   *
   * @remarks
   * Allows fine-tuning of label appearance when a value is present.
   */
  placeholderHiddenLabelCSS?: CSSUIObject

  /**
   * Custom CSS for the label when the input field is focused.
   *
   * @remarks
   * Allows fine-tuning of label appearance during input focus.
   */
  focusedLabelCSS?: CSSUIObject

  /**
   * Custom CSS for the label when the input field is active.
   *
   * @remarks
   * Allows fine-tuning of label appearance during input activation.
   */
  activeLabelCSS?: CSSUIObject

  /**
   * Additional props for the underlying Label component.
   *
   * @remarks
   * Provides full customization of the label's properties.
   */
  labelProps?: LabelProps
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

export enum InputState {
  Default = "default",
  Disabled = "disabled",
  Hovered = "hovered",
  Focused = "focused",
  Active = "active",
  HasValue = "has-value",
  Error = "error",
}

export const INPUT_STATES = Object.values(InputState)

/**
 * A customizable text input component with dynamic label and optional password visibility toggle.
 *
 * @param props - Input component properties
 * @returns A memoized, forwarded input component
 */
export const TextInput = memo(
  forwardRef<HTMLInputElement, InputProps>(
    (
      {
        label,
        type = InputType.Text,
        isError,
        errorMessage,
        disabled,
        placeholder,
        placeholderShownLabelCSS,
        placeholderHiddenLabelCSS,
        focusedLabelCSS,
        activeLabelCSS,
        labelProps,
        ...props
      }: InputProps,
      ref,
    ) => {
      const initialIsTypePassword = type === InputType.Password
      const [passwordShown, { toggle }] = useBoolean(!initialIsTypePassword)

      return (
        <FormControl
          disabled={disabled}
          errorMessage={errorMessage}
          invalid={isError}
          position="relative"
          sx={{
            // placeholder is hidden
            "&:not(:has(input:placeholder-shown)) label": {
              top: 0,
              left: "sm",
              transform: "translateY(-50%) scale(0.8)",
              zIndex: 1,
              bg: ["white", "black"],
              _disabled: {
                opacity: 1,
                bg: "transparentize(black, 40%)",
                color: "gray.600",
              },
              color: "tertiary",
              _invalid: {
                color: "danger.400",
              },
              cursor: "text",
              ...placeholderHiddenLabelCSS,
            },
            // placeholder is shown
            "&:has(input:placeholder-shown) label": {
              transform: "translateY(35%)",
              cursor: "text",
              color: "gray",
              _invalid: {
                color: "danger.400",
              },
              ...placeholderShownLabelCSS,
            },
            // when input is focused
            "&:has(input:focus-visible) label": {
              top: 0,
              left: "sm",
              transform: "translateY(-50%) scale(0.8)",
              zIndex: 1,
              bg: ["white", "black"],
              color: "primary",
              _invalid: {
                color: "danger.400",
              },
              ...focusedLabelCSS,
            },
            // when active element is input
            "&:has(input:active) label": {
              color: "primary",
              ...activeLabelCSS,
            },
          }}
        >
          <InputGroup>
            <Input
              _active={{
                borderColor: "primary",
                boxShadow: "none",
              }}
              _disabled={{
                _invalid: {
                  borderColor: "transparentize(danger.400, 70%)",
                },
              }}
              _focusVisible={{
                borderColor: "primary",
                boxShadow: "none",
              }}
              _hover={{
                borderColor: "transparentize(tertiary.500, 50%)",
                boxShadow: "none",
              }}
              _placeholder={{ opacity: 0 }}
              borderColor="transparentize(tertiary.500, 70%)"
              borderWidth="2"
              className="peer"
              placeholder={placeholder || label || ""}
              ref={ref}
              rounded="sm"
              type={initialIsTypePassword ? (passwordShown ? "text" : InputType.Password) : type}
              {...props}
            />
            {initialIsTypePassword && (
              <InputRightElement clickable>
                <IconButton h="1.75rem" onClick={toggle} size="sm" variant="ghost">
                  {passwordShown ? <EyeOffIcon /> : <EyeIcon />}
                </IconButton>
              </InputRightElement>
            )}
          </InputGroup>
          {label && (
            <Label left="sm" pointerEvents="none" position="absolute" top="0" {...labelProps}>
              {label}
            </Label>
          )}
        </FormControl>
      )
    },
  ),
)

TextInput.displayName = "TextInput"
