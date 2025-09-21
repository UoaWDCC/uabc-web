/**
 * Admin-related constants
 *
 * This file contains constants used across admin functionality.
 */

/**
 * Valid admin slugs for routing
 */
export const validSlugs = ["members", "sessions", "semesters"] as const

/**
 * Type for admin tab bar slug
 */
export type AdminTabBarSlug = (typeof validSlugs)[number]
