"use client"

import {
  Center,
  type FC,
  FormControl,
  HStack,
  Label,
  memo,
  Tag,
  MultiSelect as UIMultiSelect,
  type MultiSelectProps as UIMultiSelectProps,
} from "@yamada-ui/react"
import type { ReactNode } from "react"

export interface MultiSelectProps extends UIMultiSelectProps {
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
   * @remarks Same styling as in Select component. MultiSelect is not needed in the quick book
   * component in the hero/home page, but MultiSelect will feel left out if it doesn't have its own
   * stylised version :(
   */
  stylised?: boolean
}

/**
 * Multi select component for both mobile and desktop screens with left icon and label support.
 *
 * @param props MultiSelect component properties
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
export const MultiSelect: FC<MultiSelectProps> = memo(
  ({ children, label = "Select option(s)", icon, stylised = false, ...props }) => {
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
        <UIMultiSelect
          bgGradient={stylised ? "heroGradient" : undefined}
          clearIconProps={{
            pr: { md: "lg" },
          }}
          component={({ label, onRemove }) => (
            <Tag color="white" colorScheme="secondary" onClose={onRemove} variant="outline">
              {label}
            </Tag>
          )}
          fieldProps={{ pl: { base: "calc(lg + xs + md)", md: "calc(lg - sm - xs + xl)" } }}
          iconProps={{
            pr: { md: "lg" },
          }}
          size="lg"
          {...props}
        >
          {children}
        </UIMultiSelect>
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

MultiSelect.displayName = "MultiSelect"
