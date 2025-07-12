import { type StackProps, VStack } from "@yamada-ui/react"
import type { FC, ReactNode } from "react"

export interface ContentProps extends StackProps {
  /**
   * Content to display in the content area
   */
  children?: ReactNode
}

export const Content: FC<ContentProps> = ({ children, ...props }) => {
  return (
    <VStack h="full" p="md" {...props}>
      {children}
    </VStack>
  )
}

Content.displayName = "Content"
