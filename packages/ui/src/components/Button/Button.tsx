"use client"
import {
  type HTMLUIProps,
  Button as UIButton,
  type ButtonProps as UIButtonProps,
} from "@yamada-ui/react"
import { forwardRef, useMemo } from "react"
import { styles } from "./button.style"

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

export type ButtonProps = UIButtonProps & ButtonOptions

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
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { size = "md", variant } = props

  const buttonStyles: HTMLUIProps<"button"> = useMemo(
    () => ({
      ...(!Object.hasOwn(styles, size as keyof typeof styles) && styles.base),
      ...styles[size as keyof typeof styles],
    }),
    [size],
  )

  return <UIButton ref={ref} {...(variant !== "unstyled" && buttonStyles)} {...props} />
})

Button.displayName = "Button"
