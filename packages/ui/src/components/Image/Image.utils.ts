import type { Status } from "./Image.types"

/**
 * Determines whether the fallback image should be shown based on the image status and fallback strategy.
 *
 * @param status - The current status of the image loading process.
 * @param fallbackStrategy - The strategy for when to show the fallback image.
 * @returns True if the fallback image should be shown, false otherwise.
 */
export const shouldShowFallbackImage = (
  status: Status,
  fallbackStrategy: "beforeLoadOrError" | "onError",
): boolean =>
  (status !== "loaded" && fallbackStrategy === "beforeLoadOrError") ||
  (status === "failed" && fallbackStrategy === "onError")
