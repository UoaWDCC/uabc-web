"use client"

import {
  Box,
  Center,
  HStack,
  Label,
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
  forwardRef<HTMLSelectElement, SelectProps>(
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
          <UISelect
            fieldProps={
              icon
                ? {
                    pl: { base: "11", md: "17" },
                    pr: { base: "lg", md: "xl" },
                  }
                : { pl: { md: "6" } }
            }
            iconProps={icon ? { pr: { md: "lg" } } : { pr: { md: "6" } }}
            ref={ref}
            size="lg"
            variant={variant}
            {...props}
          >
            {children}
          </UISelect>
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
            {label && (
              <Label fontSize="lg" fontWeight="normal" lineClamp={1} mb={0}>
                {label}
              </Label>
            )}
          </HStack>
        </Box>
      )
    },
  ),
)

Select.displayName = "Select"
