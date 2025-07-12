import { Text, VStack } from "@yamada-ui/react"
import type { FC, ReactNode } from "react"
import { Heading } from "../../../Primitive"

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
