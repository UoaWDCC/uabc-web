"use client"
import {
  type ThemeProps,
  Button as UIButton,
  type ButtonProps as UIButtonProps,
} from "@yamada-ui/react"
import { forwardRef, memo } from "react"

/**
 * Additional options for the Button component
 *
 * @remarks
 * The `href` prop should ONLY be used when you intend to render the button as:
 * - Next.js Link component
 * - Yamada UI Link component
 * - HTML anchor (`<a>`) element
 *
 * When `href` is provided, the button will automatically be transformed
 * into a navigation element. Do not use `href` for non-navigation buttons.
 */
type ButtonOptions = {
  /**
   * Optional href for navigation buttons
   * @see {@link https://nextjs.org/docs/app/api-reference/components/link Next.js Link}
   * @see {@link https://yamada-ui.com/components/navigation/link Yamada UI Link}
   */
  href?: string
}

export interface ButtonProps
  extends Omit<UIButtonProps, keyof ThemeProps<"Button">>,
    ThemeProps<"Button">,
    ButtonOptions {}

/**
 * Generic Button component based on Yamada UI Button
 *
 * @param props - Combined Yamada UI Button props and custom options
 * @returns A memoized button component
 *
 * @example
 * // Standard button
 * <Button>Click me</Button>
 *
 * @example
 * // Navigation button
 * <Button as="a" href="/home">Go to Home</Button>
 */
export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    return <UIButton ref={ref} {...props} />
  }),
)

Button.displayName = "Button"
