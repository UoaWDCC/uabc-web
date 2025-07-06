"use client"

import {
  Center,
  type FC,
  FormControl,
  HStack,
  Label,
  memo,
  Select as UISelect,
  type SelectProps as UISelectProps,
} from "@yamada-ui/react"
import type { ReactNode } from "react"

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
}

/**
 * Select component for both mobile and desktop screens with left icon and label support.
 *
 * @param props - Select component properties
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
  ({ children, label = "Select option", icon, stylised = false, ...props }) => {
    return (
      <FormControl
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
          bgGradient={stylised ? "heroGradient" : "transparent"}
          fieldProps={{ pl: { base: "calc(lg + xs + md)", md: "calc(lg - sm - xs + xl)" } }}
          iconProps={{
            pr: { md: "lg" },
          }}
          size="lg"
          {...props}
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
          z={100}
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
