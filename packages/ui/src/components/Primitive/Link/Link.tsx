"use client"

import type { SearchParamsFor, ValidHrefWithCustom } from "@repo/shared"
import { buildExternalHref } from "@repo/ui/utils"
import { type Merge, Link as UILink, type LinkProps as UILinkProps } from "@yamada-ui/react"
import NextLink, { type LinkProps as NextLinkProps } from "next/link"

export type LinkProps<
  TCustom extends boolean = false,
  THref extends ValidHrefWithCustom<TCustom> = ValidHrefWithCustom<TCustom>,
> = Omit<Omit<Merge<UILinkProps, Omit<NextLinkProps, keyof UILinkProps>>, "href">, "href"> & {
  href: THref
  /**
   * Allow custom internal routes (starting with /)
   * When true, any internal route is allowed
   * When false, only predefined routes are allowed
   */
  custom?: TCustom
  /**
   * Typed query object for URL search params. If `href` is a known route,
   * its type can be augmented via `RouteToSearchParams`.
   */
  query?: SearchParamsFor<Extract<THref, string>>
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
export const Link = <
  TCustom extends boolean = false,
  THref extends ValidHrefWithCustom<TCustom> = ValidHrefWithCustom<TCustom>,
>({
  href,
  custom,
  query,
  ...props
}: LinkProps<TCustom, THref>) => {
  let nextHref: NextLinkProps["href"] = href as never
  if (query && typeof href === "string") {
    if (href.startsWith("/")) {
      nextHref = { pathname: href, query } as never
    } else if (query) {
      nextHref = buildExternalHref(href, query as Record<string, unknown>) as never
    }
  }

  return <UILink as={NextLink} href={nextHref as never} {...props} />
}
