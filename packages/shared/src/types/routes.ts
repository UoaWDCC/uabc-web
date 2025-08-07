import { Routes } from "../enums"

/**
 * Route groups for better organization
 */
export const RouteGroups = {
  public: {
    home: Routes.HOME,
    about: Routes.ABOUT,
    contact: Routes.CONTACT,
    events: Routes.EVENTS,
    book: Routes.BOOK,
    terms: Routes.TERMS,
  },
  auth: {
    login: Routes.AUTH_LOGIN,
    register: Routes.AUTH_REGISTER,
    callback: Routes.AUTH_CALLBACK,
  },
  user: {
    profile: Routes.PROFILE,
  },
} as const

/**
 * Type for all valid route values
 */
export type RouteValue = `${Routes}`

/**
 * Type for valid href values with improved type safety
 *
 * Internal routes (starting with /) must match valid application routes
 * External URLs (starting with http://, https://, etc.) are allowed
 */
export type ValidHref =
  | RouteValue
  | `https://${string}`
  | `http://${string}`
  | `mailto:${string}`
  | `tel:${string}`

/**
 * Type for valid href values that allows custom internal routes
 *
 * When custom is true, allows any internal route starting with /
 * Otherwise, only allows predefined routes and external URLs
 */
export type ValidHrefWithCustom<T extends boolean = false> = T extends true
  ? ValidHref | `/${string}`
  : ValidHref

/**
 * Utility function to get route by enum value
 */
export const getRoute = (route: Routes): string => route

/**
 * Utility function to get nested route from groups
 */
export const getNestedRoute = <T extends keyof typeof RouteGroups>(
  group: T,
  key: keyof (typeof RouteGroups)[T],
): string => {
  return RouteGroups[group][key] as string
}
