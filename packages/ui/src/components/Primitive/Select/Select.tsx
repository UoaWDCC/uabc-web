"use client"

import {
  Center,
  type FC,
  FormControl,
  HStack,
  Label,
  memo,
  mergeRefs,
  Select as UISelect,
  type SelectProps as UISelectProps,
} from "@yamada-ui/react"
import type { ReactNode, Ref } from "react"
import type { FieldPath, FieldValues, UseFormRegisterReturn } from "react-hook-form"

/**
 * Props for {@link Select} component
 *
 *  @example
 * // With React Hook Form
 * <Select
 *    errorMessage={errors.locationAndTimeId?.message}
 *    icon={<CalendarClockIcon fontSize={24} />}
 *    isError={!!errors.locationAndTimeId}
 *    items={locationAndTimeOptions}
 *    label="Location & Time"
 *    registration={register("locationAndTimeId")}
 *    stylised
 * />
 *
 * @example
 * // Manual error handling
 * <Select
 *    errorMessage="Field is required"
 *    icon={<CalendarClockIcon fontSize={24} />}
 *    isError={true}
 *    items={locationAndTimeOptions}
 *    label="Location & Time"
 *    stylised
 * />
 */
export interface SelectProps extends UISelectProps {
  /**
   * Label text of the Select component.
   *
   * @remarks
   * The label is rendered within the Select component.
   *
   * @defaultValue "Select option"
   */
  label?: string

  /**
   * Icon rendered inline to the left of the label.
   *
   * @warn This prop takes in any React Node but icons are expected.
   *
   * @see {@link https://yamada-ui.com/components/media-and-icons/icon Yamada UI Icon}
   * @see {@link https://yamada-ui.com/components/media-and-icons/lucide Yamda UI Lucide Icon}
   */
  icon?: ReactNode

  /**
   * Whether to have a background gradient and circle around the inline icon.
   *
   * @remarks To use in the quick book Select components in the hero/home page.
   */
  stylised?: boolean

  /**
   * Indicates whether the Select is in an error state.
   *
   * @remarks
   * When `true`, the input displays an error border and error message.
   * Works seamlessly with React Hook Form validation.
   *
   * @defaultValue `false`
   */
  isError?: boolean

  /**
   * The error message displayed when the Select is in an error state.
   *
   * @remarks
   * If not provided, no error message will be shown.
   * Typically used with React Hook Form error messages.
   */
  errorMessage?: string

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

  ref?: Ref<HTMLSelectElement>
}

/**
 * Select component for both mobile and desktop screens with left icon and label support.
 *
 * @param props Select component properties
 * @returns A select component
 *
 * @example
 * <Select icon={<>A React Node</>} label="A label">
 *   <Option value="1">Option 1</Option>
 *   <Option value="2">Option 2</Option>
 *   <Option value="3">Option 3</Option>
 * </Select>
 *
 * @see {@link https://yamada-ui.com/components/forms/select Yamada UI Select Docs}
 */
export const Select: FC<SelectProps> = memo(
  ({
    children,
    label = "Select option",
    icon,
    stylised = false,
    isError,
    errorMessage,
    registration,
    ref,
    ...props
  }) => {
    const selectRef = mergeRefs(registration?.ref ?? null, ref)

    const selectProps = {
      name: registration?.name,
      onBlur: registration?.onBlur,
      onChange: (value: string) => {
        registration?.onChange?.({
          target: { name: registration?.name || "", value },
          type: "change",
        })
      },
      ...props,
      ref: selectRef,
    }

    return (
      <FormControl
        errorMessage={errorMessage}
        invalid={isError}
        position="relative"
        sx={{
          "&:not(:has(div[data-placeholder]))": {
            label: {
              visibility: "hidden",
            },
          },
        }}
      >
        <UISelect
          _focus={{
            borderColor: isError ? ["danger.500", "danger.400"] : ["primary.500", "primary.400"],
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
          bgGradient={stylised ? "heroGradient" : "transparent"}
          fieldProps={{ px: { base: "calc(lg + xs + md)", md: "calc(lg - sm - xs + xl)" } }}
          iconProps={{
            pr: { md: "lg" },
          }}
          size="lg"
          {...selectProps}
        >
          {children}
        </UISelect>
        <HStack
          align="center"
          gap={{ base: "xs", md: "sm" }}
          mx="calc(md - xs)"
          pl={{ md: "md" }}
          pointerEvents="none"
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
          z={1}
        >
          <Center
            borderColor={stylised ? "gray.600" : "transparent"}
            borderRadius="full"
            borderWidth="thin"
            h="fit-content"
            p="xs"
            w="fit-content"
          >
            {icon}
          </Center>
          <Label fontSize="lg" fontWeight="normal" mb={0}>
            {label}
          </Label>
        </HStack>
      </FormControl>
    )
  },
)

Select.displayName = "Select"
