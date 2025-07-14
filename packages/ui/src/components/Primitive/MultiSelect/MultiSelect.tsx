"use client"

import {
  Box,
  Center,
  HStack,
  Label,
  memo,
  Tag,
  MultiSelect as UIMultiSelect,
  type MultiSelectProps as UIMultiSelectProps,
} from "@yamada-ui/react"
import type { ReactNode } from "react"
import { forwardRef } from "react"

export interface MultiSelectProps extends Omit<UIMultiSelectProps, "variant"> {
  /**
   * Label text of the MultiSelect component.
   *
   * @remarks
   * The label is rendered within the MultiSelect component if provided by the parent.
   *
   * @defaultValue "Select option(s)"
   */
  label: string
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
    ({ children, label = "Select option(s)", icon, variant, disabled, ...props }, ref) => {
      const stylised = variant === "stylised"
      const selectProps = {
        variant,
        ...props,
        ref,
      }
      return (
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
              opacity={disabled ? 0.4 : 1}
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
      )
    },
  ),
)

MultiSelect.displayName = "MultiSelect"
