import { type StackProps, VStack } from "@yamada-ui/react"
import type { FC, ReactNode } from "react"

/**
 * Props for {@link Content} component
 */
export interface ContentProps extends StackProps {
  /**
   * Content to display in the content area
   */
  children?: ReactNode
}

/**
 * Content wrapper component for the right side content area of CalendarSelectPopup
 *
 * Provides a consistent layout container for custom content in the calendar popup.
 * Uses VStack with standard spacing and padding.
 *
 * @param props Content component properties
 * @returns A content wrapper component
 *
 * @example
 * ```tsx
 * <CalendarSelectPopup.Content>
 *   <CalendarSelectPopup.Header title="Select Date" />
 *   <CalendarSelectPopup.Body>
 *     <Button>Action</Button>
 *   </CalendarSelectPopup.Body>
 * </CalendarSelectPopup.Content>
 * ```
 */
export const Content: FC<ContentProps> = ({ children, ...props }) => {
  return (
    <VStack h="full" p="md" {...props}>
      {children}
    </VStack>
  )
}

Content.displayName = "Content"
