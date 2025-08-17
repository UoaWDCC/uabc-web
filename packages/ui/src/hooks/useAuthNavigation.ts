"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef } from "react"
import { NavigationUtils } from "../utils"

/**
 * Options for the useAuthNavigation hook
 */
interface UseAuthNavigationOptions {
  /**
   * Default redirect URL when no returnUrl is provided
   */
  defaultRedirectUrl?: string
  /**
   * Whether to automatically redirect on successful authentication
   */
  autoRedirect?: boolean
  /**
   * Callback to execute before navigation
   */
  onBeforeNavigate?: (url: string) => void
}

/**
 * Return type for useAuthNavigation hook
 */
interface UseAuthNavigationReturn {
  /**
   * The return URL from search parameters
   */
  returnUrl: string | null
  /**
   * Navigate to the return URL or default
   */
  navigateToReturnUrl: (defaultUrl?: string) => void
  /**
   * Build a login URL with return URL parameter
   */
  buildLoginUrl: (returnUrl: string) => string
  /**
   * Clear the return URL from the current URL
   */
  clearReturnUrl: () => void
}

/**
 * React hook for handling authentication navigation with return URLs
 *
 * This hook provides utilities for managing return URLs during authentication flows,
 * preventing navigation conflicts and ensuring proper redirect behavior.
 *
 * @param options Configuration options for the hook
 * @returns Object containing navigation utilities and return URL state
 *
 * @example
 * ```tsx
 * const { returnUrl, navigateToReturnUrl, buildLoginUrl } = useAuthNavigation({
 *   defaultRedirectUrl: "/profile",
 *   autoRedirect: true
 * })
 *
 * // Build login URL with return URL
 * const loginUrl = buildLoginUrl("/book")
 *
 * // Navigate to return URL or default
 * navigateToReturnUrl()
 * ```
 */
export const useAuthNavigation = (
  options: UseAuthNavigationOptions = {},
): UseAuthNavigationReturn => {
  const { defaultRedirectUrl = "/profile", autoRedirect = false, onBeforeNavigate } = options

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const hasNavigatedRef = useRef(false)

  const returnUrl = searchParams.get("returnUrl")

  const navigateToReturnUrl = useCallback(
    (defaultUrl?: string) => {
      if (hasNavigatedRef.current) {
        return
      }

      const decoded = returnUrl ? decodeURIComponent(returnUrl) : null
      const candidate = decoded ?? defaultUrl ?? defaultRedirectUrl
      const targetUrl = NavigationUtils.isExternalUrl(candidate)
        ? (defaultUrl ?? defaultRedirectUrl)
        : candidate

      onBeforeNavigate?.(targetUrl)
      hasNavigatedRef.current = true
      router.push(targetUrl)
    },
    [returnUrl, defaultRedirectUrl, router, onBeforeNavigate],
  )

  const buildLoginUrl = useCallback((returnUrl: string): string => {
    return NavigationUtils.buildInternalUrl("/auth/login", { returnUrl })
  }, [])

  const clearReturnUrl = useCallback(() => {
    // Create a new URLSearchParams object from current search params
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete("returnUrl")

    // Build the new URL without the returnUrl parameter
    const newSearch = newSearchParams.toString()
    const newPath = newSearch ? `${pathname}?${newSearch}` : pathname

    // Use router.replace to update the URL without adding to history
    router.replace(newPath)
  }, [router, searchParams, pathname])

  // Auto-redirect if enabled and returnUrl exists
  useEffect(() => {
    if (autoRedirect && returnUrl && !hasNavigatedRef.current) {
      navigateToReturnUrl()
    }
  }, [autoRedirect, returnUrl, navigateToReturnUrl])

  return {
    returnUrl,
    navigateToReturnUrl,
    buildLoginUrl,
    clearReturnUrl,
  }
}
