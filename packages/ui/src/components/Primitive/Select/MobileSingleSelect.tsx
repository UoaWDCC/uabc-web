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

export interface MobileSingleSelectProps extends UISelectProps {
  /**
   * Label text of the Select component.
   *
   * @remarks
   * If not provided, no label will be rendered. The label is rendered within the Select component.
   *
   * @defaultValue "Select option"
   */
  label?: string

  /**
   * Icon rendered inline to the left of the label.
   *
   * @warn This prop takes in any React Node but icons are expected.
   * @see {@link https://yamada-ui.com/components/media-and-icons/icon Yamada UI Icon}
   * @see {@link https://yamada-ui.com/components/media-and-icons/lucide Yamda UI Lucide Icon}
   */
  icon?: ReactNode
}

/**
 * Select component for mobile screens with left icon and label support.
 *
 * @param props - Select component properties
 * @returns A select component
 *
 * @example
 * <MobileSingleSelect icon={<>A React Node</>} label="A label">
 *   <Option value="1">Option 1</Option>
 *   <Option value="2">Option 2</Option>
 *   <Option value="3">Option 3</Option>
 * </MobileSingleSelect>
 *
 * @see {@link https://yamada-ui.com/components/forms/select Yamada UI Select Docs}
 */
export const MobileSingleSelect: FC<MobileSingleSelectProps> = memo(
  ({ children, label = "Select option", icon, ...props }) => {
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
          fieldProps={{ pl: { base: "calc(lg + md)", md: "calc(lg - sm + xl)" } }}
          iconProps={{
            pr: { md: "lg" },
          }}
          portalProps={{ disabled: false }}
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
            bgGradient={{ md: "secondaryGradient" }}
            borderColor={["gray.200", "gray.700"]}
            borderRadius="full"
            borderWidth={{ base: 0, md: "medium" }}
            h="fit-content"
            p={1}
            w="fit-content"
          >
            {icon}
          </Center>
          <Label fontSize={18} fontWeight="normal" mb={0}>
            {label}
          </Label>
        </HStack>
      </FormControl>
    )
  },
)

MobileSingleSelect.displayName = "MobileSingleSelect"
