import { type FC, type SelectProps, Select as UISelect, memo } from "@yamada-ui/react"

export const Select: FC<SelectProps> = memo(({ children, ...props }) => {
  return <UISelect {...props}>{children}</UISelect>
})

Select.displayName = "Select"
