"use client"

import {
  Box,
  Center,
  FormControl,
  type FormControlProps,
  HStack,
  handlerAll,
  Label,
  memo,
  mergeRefs,
  Tag,
  MultiSelect as UIMultiSelect,
  type MultiSelectProps as UIMultiSelectProps,
} from "@yamada-ui/react"
import type { ReactNode } from "react"
import { forwardRef } from "react"
import type { FieldPath, FieldValues, UseFormRegisterReturn } from "react-hook-form"

export interface MultiSelectProps extends Omit<UIMultiSelectProps, "variant"> {
  /**
   * Label text of the MultiSelect component.
   *
   * @remarks
   * The label is rendered within the MultiSelect component.
   *
   * @defaultValue "Select option(s)"
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
  variant?: "stylised" | UIMultiSelectProps["variant"]
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
   * <MultiSelect {...register("fieldName")}/>
   */
  registration?: UseFormRegisterReturn<FieldPath<FieldValues>>
}

/**
 * Multi select component for both mobile and desktop screens with left icon and label support.
 *
 * @param props MultiSelect component properties
 * @param ref Ref to the underlying select element
 * @returns A multi select component
 *
 * @example
 * <MultiSelect icon={<>A React Node</>} label="A label">
 *   <Option value="1">Option 1</Option>
 *   <Option value="2">Option 2</Option>
 *   <Option value="3">Option 3</Option>
 * </MultiSelect>
 *
 * @see {@link https://yamada-ui.com/components/forms/multi-select Yamada UI Select Docs}
 */
export const MultiSelect = memo(
  forwardRef<HTMLDivElement, MultiSelectProps>(
    (
      {
        children,
        label = "Select option(s)",
        icon,
        variant,
        formControlProps,
        registration,
        ...props
      },
      ref,
    ) => {
      const selectRef = mergeRefs(registration?.ref ?? null, ref)

      const { disabled } = formControlProps ?? {}

      const stylised = variant === "stylised"

      const selectProps = {
        variant,
        name: registration?.name,
        onBlur: registration?.onBlur,
        ...props,
        onChange: handlerAll(
          props.onChange,
          registration?.onChange
            ? (value: string[]) => {
                registration.onChange?.({
                  target: { name: registration?.name || "", value },
                  type: "change",
                })
              }
            : undefined,
        ),
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
            <UIMultiSelect
              clearIconProps={{
                pr: { md: "6" },
              }}
              component={({ label, onRemove }) => (
                <Tag color="white" colorScheme="secondary" onClose={onRemove} variant="outline">
                  {label}
                </Tag>
              )}
              fieldProps={
                icon
                  ? {
                      pl: { base: "11", md: "17" },
                      pr: { base: "lg", md: "xl" },
                    }
                  : { pl: { md: "6" } }
              }
              iconProps={icon ? { pr: { md: "lg" } } : { pr: { md: "6" } }}
              size="lg"
              {...selectProps}
            >
              {children}
            </UIMultiSelect>
            <HStack
              align="center"
              gap={{ base: "xs", md: "sm" }}
              mx={icon ? { md: "md" } : undefined}
              opacity={disabled ? 0.4 : undefined}
              pointerEvents="none"
              position="absolute"
              px={{ base: "sm", md: icon ? "3" : "sm" }}
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

MultiSelect.displayName = "MultiSelect"
