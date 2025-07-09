import { HStack, type StackProps, Text } from "@yamada-ui/react"
import type { ReactNode } from "react"

/**
 * Props for the {@link IconWithText} component.
 */
export interface IconWithTextProps extends StackProps {
  /**
   * The icon to display.
   */
  icon: ReactNode

  /**
   * The label to display next to the icon.
   */
  label: string
}

/**
 * IconWithText is a component that displays an icon alongside text in a horizontal stack.
 * It allows for custom styling and layout through stack props.
 *
 * @example
 * <IconWithText
 *   icon={<Icon name="location" />}
 *   text="Auckland City Hospital"
 * />
 *
 * @example
 * // With custom children instead of default text
 * <IconWithText icon={<Icon name="calendar" />}>
 *   <Text color="primary">Tuesday, 12th May</Text>
 * </IconWithText>
 */
export const IconWithText = ({ icon, label, children, ...props }: IconWithTextProps) => {
  return (
    <HStack gap="xs" {...props}>
      {icon}
      {label && <Text>{label}</Text>}
      {children}
    </HStack>
  )
}
