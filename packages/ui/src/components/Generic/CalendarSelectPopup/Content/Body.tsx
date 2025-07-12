import { type StackProps, VStack } from "@yamada-ui/react"
import type { FC, ReactNode } from "react"

export interface ContentBodyProps extends StackProps {
  /**
   * Content to display in the body
   */
  children?: ReactNode
}

/**
 * Body component for the right side content area of CalendarSelectPopup
 */
export const Body: FC<ContentBodyProps> = ({ children, ...props }) => {
  return (
    <VStack gap="md" p="md" {...props}>
      {children}
    </VStack>
  )
}

Body.displayName = "Body"
