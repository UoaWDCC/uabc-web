import type { As, HeadingProps as UIHeadingProps } from "@yamada-ui/react"
import { Heading as UIHeading } from "@yamada-ui/react"
import type { FC } from "react"
import { memo } from "react"

/**
 * Default font sizes for different heading levels
 *
 * @remarks
 * Provides default font size styling across different heading levels
 * h1 is the largest, while h6 is the smallest for visual hierarchy
 */
export const DEFAULT_FONT_SIZES: Record<string, string> = {
  h1: "3xl",
  h2: "2xl",
  h3: "xl",
  h4: "lg",
  h5: "md",
  h6: "sm",
}

/**
 * Default font weights for different heading levels
 *
 * @remarks
 * Provides default font weight styling across different heading levels
 * h1-h3 use bold, while h4-h6 use semibold for visual hierarchy
 */
export const DEFAULT_FONT_WEIGHTS: Record<string, string> = {
  h1: "bold",
  h2: "bold",
  h3: "bold",
  h4: "semibold",
  h5: "semibold",
  h6: "semibold",
}

/**
 * Available font weights
 *
 * @remarks
 * These weights are available for use in the {@link Heading} component
 */
export enum FONT_WEIGHTS {
  BOLD = "bold",
  HAIRLINE = "hairline",
  THIN = "thin",
  LIGHT = "light",
  MEDIUM = "medium",
  SEMIBOLD = "semibold",
  EXTRABOLD = "extrabold",
  BLACK = "black",
}

/**
 * Props for {@link Heading} component
 *
 * @remarks
 * Extends Yamada UI's HeadingProps with a custom 'as' prop
 * Allows specifying heading level while omitting the original 'as' prop
 *
 * @warn
 * RECOMMENDED: Use `Heading.h1`, `Heading.h2`, etc. instead of manually specifying 'as'
 *
 * @example
 * // Recommended usage
 * <Heading.h2>Section Title</Heading.h2>
 *
 * @example
 * // Alternative usage (not recommended)
 * <Heading as="h2">Section Title</Heading>
 */
export type AsString = As | (string & {})

export interface HeadingProps extends Omit<UIHeadingProps, "as"> {
  /**
   * Specifies the heading level (h1-h6)
   *
   * @defaultValue 'h1'
   * @warn Prefer using `Heading.h1`, `Heading.h2`, etc.
   */
  as?: AsString
}

/**
 * Heading component with dynamic styling based on heading level
 *
 * @remarks
 * Automatically sets font size and weight based on the specified heading level
 * Provides a warning and fallback for invalid heading levels
 *
 * @warn
 * RECOMMENDED: Use `Heading.h1`, `Heading.h2`, etc. instead of manually specifying 'as'
 *
 * @param props - Heading component properties
 * @returns A styled heading element
 */
export const Heading: FC<HeadingProps> = memo(({ children, as = "h1", ...props }) => {
  const fontSize = DEFAULT_FONT_SIZES[as as string] || "3xl"
  const fontWeight = DEFAULT_FONT_WEIGHTS[as as string] || "bold"

  if (!Object.keys(DEFAULT_FONT_SIZES).includes(as as string)) {
    console.warn(`Invalid heading level "${as}". Falling back to "h1".`)
    as = "h1"
  }

  return (
    <UIHeading as={as as As} fontSize={fontSize} fontWeight={fontWeight} {...props}>
      {children}
    </UIHeading>
  )
})

Heading.displayName = "Heading"
