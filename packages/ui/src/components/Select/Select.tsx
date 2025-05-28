import {
  type FC,
  FormControl,
  HStack,
  Label,
  Select as UISelect,
  type SelectProps as UISelectProps,
  memo,
} from "@yamada-ui/react"
import type { ReactNode } from "react"

export interface SelectProps extends UISelectProps {
  /**
   * Label text of the Select component.
   *
   * @remarks
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
 * <Select icon={<>A React Node</>} label="A label">
 *   <Option value="1">Option 1</Option>
 *   <Option value="2">Option 2</Option>
 *   <Option value="3">Option 3</Option>
 * </Select>
 *
 * @see {@link https://yamada-ui.com/components/forms/select Yamada UI Select Docs}
 */
export const Select: FC<SelectProps> = memo(
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
          fieldProps={{ px: "calc(md - xs + xl)" }}
          portalProps={{ disabled: false }}
          size="lg"
          {...props}
        >
          {children}
        </UISelect>
        <HStack
          align="center"
          mx="calc(md - xs)"
          pointerEvents="none"
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
        >
          {icon}
          <Label fontSize={18} fontWeight="normal" mb={0}>
            {label}
          </Label>
        </HStack>
      </FormControl>
    )
  },
)

Select.displayName = "Select"
