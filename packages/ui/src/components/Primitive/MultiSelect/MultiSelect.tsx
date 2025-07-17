"use client"

import {
  Box,
  Center,
  HStack,
  Label,
  Tag,
  MultiSelect as UIMultiSelect,
  type MultiSelectProps as UIMultiSelectProps,
} from "@yamada-ui/react"
import type { ReactNode } from "react"
import { forwardRef, memo } from "react"

export interface MultiSelectProps extends Omit<UIMultiSelectProps, "variant"> {
  /**
   * Label text of the MultiSelect component.
   *
   * @remarks
   * The label is rendered within the MultiSelect component if provided by the parent.
   */
  label?: string
  /**
   * Icon rendered inline to the left of the label.
   *
   * @warn This prop takes in any React Node but icons are expected.
   *
   * @see {@link https://yamada-ui.com/components/media-and-icons/icon Yamada UI Icon}
   * @see {@link https://yamada-ui.com/components/media-and-icons/lucide Yamada UI Lucide Icon}
   */
  icon?: ReactNode
  /**
   * Whether to have a background gradient and circle around the inline icon.
   *
   * @remarks Same styling as in Select component.
   */
  variant?: "stylised" | UIMultiSelectProps["variant"]
}

/**
 * MultiSelect component for both mobile and desktop screens with left icon and label support.
 *
 * @param props MultiSelect component properties
 * @param ref Ref to the underlying multi-select element
 * @returns A multi-select component
 *
 * @example
 * <MultiSelect icon={<>A React Node</>} label="A label">
 *   <Option value="1">Option 1</Option>
 *   <Option value="2">Option 2</Option>
 *   <Option value="3">Option 3</Option>
 * </MultiSelect>
 *
 * @see {@link https://yamada-ui.com/components/forms/multi-select Yamada UI MultiSelect Docs}
 */
export const MultiSelect = memo(
  forwardRef<HTMLDivElement, MultiSelectProps>(
    ({ children, label, icon, variant, disabled, ...props }, ref) => {
      const stylised = variant === "stylised"

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
            component={({ label, onRemove }) => (
              <Tag color="white" colorScheme="secondary" onClose={onRemove} variant="outline">
                {label}
              </Tag>
            )}
            data-has-icon={!!icon}
            ref={ref}
            size="lg"
            variant={variant}
            {...props}
          >
            {children}
          </UIMultiSelect>
          <HStack
            align="center"
            gap="0"
            pointerEvents="none"
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            z={1}
          >
            {icon && (
              <Center
                _before={{
                  content: "''",
                  position: "absolute",
                  inset: 0,
                  rounded: "full",
                  outline: stylised ? "1px solid" : "none",
                  outlineColor: "gray.600",
                  outlineOffset: "-8px",
                }}
                fontSize="lg"
                h="6xs"
                opacity={disabled ? 0.4 : 1}
                position="relative"
                rounded="full"
                w="6xs"
              >
                {icon}
              </Center>
            )}
            {label && (
              <Label fontWeight="normal" lineClamp={1} mb={0}>
                {label}
              </Label>
            )}
          </HStack>
        </Box>
      )
    },
  ),
)

MultiSelect.displayName = "MultiSelect"
