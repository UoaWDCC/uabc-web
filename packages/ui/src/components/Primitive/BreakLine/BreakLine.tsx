import { HStack, Separator, type SeparatorProps, Text } from "@yamada-ui/react"
import type { FC } from "react"

/**
 * Props for {@link BreakLine} component
 */
export interface BreakLineProps {
  /**
   * Label to display in the middle of the break line.
   *
   * @remarks {@link Separator}s are joined together if label not provided
   */
  label?: string
  /**
   * Properties for {@link Separator} 1
   */
  separatorProps1?: SeparatorProps
  /**
   * Properties for {@link Separator} 2
   */
  separatorProps2?: SeparatorProps
}

/**
 * Horizontl break line component with optional label.
 *
 * @param params BreakLine component props
 * @returns A break line component
 */
export const BreakLine: FC<BreakLineProps> = ({ label, separatorProps1, separatorProps2 }) => {
  return (
    <HStack gap={!label ? 0 : undefined}>
      <Separator {...separatorProps1} />
      {label && <Text>{label}</Text>}
      <Separator {...separatorProps2} />
    </HStack>
  )
}
