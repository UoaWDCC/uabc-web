import { Button, Heading } from "@repo/ui/components/Primitive"
import { LockIcon } from "@yamada-ui/lucide"
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIndicator,
  type EmptyStateProps,
  EmptyStateTitle,
} from "@yamada-ui/react"
import NextLink from "next/link"
import type { FC } from "react"

/**
 * Props for {@link NotAuthorised} component
 */
export interface NotAuthorisedProps
  extends Omit<EmptyStateProps, "title" | "description" | "indicator" | "children"> {
  /**
   * The title to display in the empty state
   * @defaultValue "Not Authorised"
   */
  title?: string
  /**
   * The description text to display in the empty state
   * @defaultValue "You are not authorised to view this page."
   */
  description?: string
  /**
   * Label for the return button
   * @defaultValue "Return Home"
   */
  returnLabel?: string
  /**
   * Props for the return button
   */
  buttonProps?: React.ComponentProps<typeof Button>
  /**
   * The href for the return button
   * @defaultValue "/"
   */
  href?: string
}

/**
 * Generic not authorised state component using Yamada UI's EmptyState.
 *
 * @param props NotAuthorised component properties
 * @returns A styled empty state for not authorised access
 *
 * @example
 * <NotAuthorised />
 * <NotAuthorised title="Access Denied" description="You must be an admin to view this page." />
 */
export const NotAuthorised: FC<NotAuthorisedProps> = ({
  title = "Not Authorised",
  description = "You do not have permission to view this page.",
  returnLabel = "Return Home",
  buttonProps,
  href = "/",
  ...rest
}) => {
  return (
    <EmptyState {...rest}>
      <EmptyStateIndicator>
        <LockIcon fontSize="5xl" />
      </EmptyStateIndicator>
      <EmptyStateTitle as={Heading.h2}>{title}</EmptyStateTitle>
      <EmptyStateDescription textAlign="center">{description}</EmptyStateDescription>
      <Button as={NextLink} colorScheme="primary" href={href} placeSelf="center" {...buttonProps}>
        {returnLabel}
      </Button>
    </EmptyState>
  )
}

NotAuthorised.displayName = "NotAuthorised"
