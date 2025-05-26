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
  label?: string
  icon?: ReactNode
}

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
          fieldProps={{ px: "calc(lg + xl)" }}
          iconProps={{ mr: "calc(lg - sm)", right: 0 }}
          portalProps={{ disabled: false }}
          size="lg"
          {...props}
        >
          {children}
        </UISelect>
        <HStack
          align="center"
          mx="calc(lg - xs)"
          pointerEvents="none"
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
        >
          {icon}
          <Label fontSize={18} mb={0}>
            {label}
          </Label>
        </HStack>
      </FormControl>
    )
  },
)

Select.displayName = "Select"
