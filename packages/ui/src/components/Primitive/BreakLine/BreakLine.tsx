import { HStack, Separator, type SeparatorProps, type StackProps, Text } from "@yamada-ui/react"
import type { FC } from "react"

/**
 * Props for {@link BreakLine} component
 */
export interface BreakLineProps {
  /**
   * Label to display in the middle of the break line.
   */
  label: string
  /**
   * Properties for {@link Separator} 1
   */
  separatorProps1?: SeparatorProps
  /**
   * Properties for {@link Separator} 2
   */
  separatorProps2?: SeparatorProps

  /**
   * Properties for {@link HStack}
   */
  stackProps?: StackProps
}

/**
 * Horizontal break line component with label.
 *
 * @param params BreakLine component props
 * @returns A break line component
 */
export const BreakLine: FC<BreakLineProps> = ({
  label,
  separatorProps1,
  separatorProps2,
  stackProps,
}) => {
  return (
    <HStack {...stackProps}>
      <Separator {...separatorProps1} />
      <Text>{label}</Text>
      <Separator {...separatorProps2} />
    </HStack>
  )
}
