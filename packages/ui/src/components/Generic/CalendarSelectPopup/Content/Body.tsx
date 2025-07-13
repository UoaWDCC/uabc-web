import { type StackProps, VStack } from "@yamada-ui/react"
import type { FC, ReactNode } from "react"

/**
 * Props for {@link Body} component
 */
export interface ContentBodyProps extends StackProps {
  /**
   * Content to display in the body
   */
  children?: ReactNode
}

/**
 * Body component for the content area of CalendarSelectPopup
 *
 * Provides a standardized body layout with consistent spacing and padding.
 * Typically used to contain navigation buttons, form controls, or other interactive elements.
 *
 * @param props Body component properties
 * @returns A body component for content layout
 *
 * @example
 * ```tsx
 * // Basic usage with navigation buttons
 * <CalendarSelectPopup.Body>
 *   <CalendarSelectPopup.BackButton />
 *   <CalendarSelectPopup.NextButton />
 * </CalendarSelectPopup.Body>
 *
 * // With custom content and styling
 * <CalendarSelectPopup.Body gap="lg" align="center">
 *   <Text>Custom content here</Text>
 *   <Button>Custom Action</Button>
 * </CalendarSelectPopup.Body>
 * ```
 */
export const Body: FC<ContentBodyProps> = ({ children, ...props }) => {
  return (
    <VStack gap="md" p="md" {...props}>
      {children}
    </VStack>
  )
}

Body.displayName = "Body"
