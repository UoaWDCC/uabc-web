import { Heading } from "@repo/ui/components/Primitive"
import { Text, VStack } from "@yamada-ui/react"
import type { FC, ReactNode } from "react"

/**
 * Props for {@link Header} component
 */
export interface ContentHeaderProps {
  /**
   * Header title content
   */
  title?: ReactNode

  /**
   * Optional subtitle or description
   */
  subtitle?: ReactNode

  /**
   * Custom content for the header
   */
  children?: ReactNode
}

/**
 * Header component for the content area of CalendarSelectPopup
 *
 * Provides a standardized header layout with title, subtitle, and custom content support.
 * Uses centered text alignment and consistent typography.
 *
 * @param props Header component properties
 * @returns A header component with title and subtitle
 *
 * @example
 * ```tsx
 * // Basic usage with title and subtitle
 * <CalendarSelectPopup.Header
 *   title="Select Date"
 *   subtitle="Choose a date for your appointment"
 * />
 *
 * // With custom content
 * <CalendarSelectPopup.Header title="Step 1 of 3">
 *   <Text color="muted">Additional instructions here</Text>
 * </CalendarSelectPopup.Header>
 * ```
 */
export const Header: FC<ContentHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <VStack textAlign="center">
      {title && (
        <Heading.h3 fontSize="xl" fontWeight="semibold">
          {title}
        </Heading.h3>
      )}
      {subtitle && (
        <Text color="muted" fontSize="lg">
          {subtitle}
        </Text>
      )}
      {children}
    </VStack>
  )
}

Header.displayName = "Header"
