"use client"

import {
  Box,
  Center,
  HStack,
  Select as UISelect,
  type SelectProps as UISelectProps,
} from "@yamada-ui/react"
import type { ReactNode } from "react"
import { forwardRef, memo } from "react"

export interface SelectProps extends Omit<UISelectProps, "variant"> {
  /**
   * Label text of the Select component.
   *
   * @remarks
   * The label is rendered within the Select component if provided by the parent.
   * @deprecated This prop is not used in the Select component.
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
   * @remarks Same styling as in Select component. Select is not needed in the quick book
   * component in the hero/home page, but Select will feel left out if it doesn't have its own
   * stylised version :(
   */
  variant?: "stylised" | UISelectProps["variant"]
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
  forwardRef<HTMLDivElement, SelectProps>(
    ({ children, label, icon, variant, disabled, ...props }, ref) => {
      const stylised = variant === "stylised"

      return (
        <Box position="relative">
          <UISelect
            data-has-icon={!!icon}
            placeholder={label}
            ref={ref}
            size="lg"
            sx={{
              "&[data-placeholder]": {
                color: ["black", "white"],
              },
            }}
            variant={variant}
            {...props}
          >
            {children}
          </UISelect>
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
          </HStack>
        </Box>
      )
    },
  ),
)

Select.displayName = "Select"
