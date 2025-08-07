"use client"

import type { ValidHrefWithCustom } from "@repo/shared/types/routes"
import { type Merge, type LinkProps as UILinkProps, ui } from "@yamada-ui/react"
import NextLink, { type LinkProps as NextLinkProps } from "next/link"

export type LinkProps<T extends boolean = false> = Omit<
  Omit<Merge<UILinkProps, Omit<NextLinkProps, keyof UILinkProps>>, "href">,
  "href"
> & {
  href: ValidHrefWithCustom<T>
  /**
   * Allow custom internal routes (starting with /)
   * When true, any internal route is allowed
   * When false, only predefined routes are allowed
   */
  custom?: T
}

/**
 * Typed Link component that extends Next.js Link with route-based typing
 *
 * This component provides type safety for href values by only allowing
 * valid application routes or external URLs. When custom is true,
 * it also allows any internal route starting with /.
 *
 * @example
 * ```tsx
 * // Valid internal routes
 * <Link href="/">Home</Link>
 * <Link href="/auth/login">Login</Link>
 *
 * // Valid external URLs
 * <Link href="https://example.com">External</Link>
 *
 * // With custom routes enabled
 * <Link href="/custom-route" custom>Custom Route</Link>
 *
 * // TypeScript will error for invalid routes when custom is false
 * <Link href="/invalid-route">Invalid</Link> // ❌
 * ```
 */
export const Link = <T extends boolean = false>({ href, custom, ...props }: LinkProps<T>) => {
  return <ui.a as={NextLink} href={href} {...props} />
}
