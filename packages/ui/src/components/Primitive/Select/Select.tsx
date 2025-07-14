"use client"

import {
  Box,
  Center,
  FormControl,
  type FormControlProps,
  HStack,
  Label,
  memo,
  mergeRefs,
  Select as UISelect,
  type SelectProps as UISelectProps,
} from "@yamada-ui/react"
import type { ReactNode } from "react"
import { forwardRef } from "react"
import type { FieldPath, FieldValues, UseFormRegisterReturn } from "react-hook-form"

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
   * @remarks Same styling as in Select component. Select is not needed in the quick book
   * component in the hero/home page, but Select will feel left out if it doesn't have its own
   * stylised version :(
   */
  stylised?: boolean
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
   * <Select registration={register("fieldName")}/>
   */
  registration?: UseFormRegisterReturn<FieldPath<FieldValues>>
}

/**
 * Select component for both mobile and desktop screens with left icon and label support.
 *
 * @param props Select component properties
 * @param ref Ref to the underlying select element
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
export const Select = memo(
  forwardRef<HTMLSelectElement, SelectProps>(
    (
      {
        children,
        label = "Select option",
        icon,
        stylised = false,
        formControlProps,
        registration,
        ...props
      },
      ref,
    ) => {
      const selectRef = mergeRefs(registration?.ref ?? null, ref)

      const { disabled } = formControlProps ?? {}

      const selectProps = {
        variant: "gradient" as const,
        name: registration?.name,
        onBlur: registration?.onBlur,
        onChange: registration?.onChange
          ? (value: string) => {
              registration?.onChange?.({
                target: { name: registration?.name || "", value },
                type: "change",
              })
            }
          : undefined,
        ...props,
        ref: selectRef,
      }

      return (
        <FormControl {...formControlProps}>
          <Box
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
              bgGradient={stylised ? "heroGradient" : undefined}
              fieldProps={
                icon
                  ? {
                      pl: { base: "calc(lg + xs + md)", md: "14" },
                      pr: { base: "lg", md: "xl" },
                    }
                  : undefined
              }
              iconProps={icon ? { pr: { md: "lg" } } : undefined}
              size="lg"
              {...selectProps}
            >
              {children}
            </UISelect>
            <HStack
              align="center"
              gap={{ base: "xs", md: "sm" }}
              opacity={disabled ? 0.4 : undefined}
              pointerEvents="none"
              position="absolute"
              px="md"
              top="50%"
              transform="translateY(-50%)"
              z={1}
            >
              <Center
                borderColor="gray.600"
                borderRadius="full"
                borderWidth={stylised ? "thin" : "0"}
                h="fit-content"
                p="xs"
                w="fit-content"
              >
                {icon}
              </Center>
              <Label fontSize="lg" fontWeight="normal" lineClamp={1} mb={0}>
                {label}
              </Label>
            </HStack>
          </Box>
        </FormControl>
      )
    },
  ),
)

Select.displayName = "Select"
