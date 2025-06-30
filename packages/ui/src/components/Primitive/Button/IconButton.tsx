"use client"
import {
  type HTMLUIProps,
  IconButton as UIIconButton,
  type IconButtonProps as UIIconButtonProps,
} from "@yamada-ui/react"
import { forwardRef, memo, useMemo } from "react"
import { styles } from "./icon-button.style"

/**
 * Additional options for the IconButton component
 *
 * @remarks
 * The `href` prop should ONLY be used when you intend to render the icon button as:
 * - Next.js Link component
 * - Yamada UI Link component
 * - HTML anchor (`<a>`) element
 *
 * When `href` is provided, the icon button will automatically be transformed
 * into a navigation element. Do not use `href` for non-navigation icon buttons.
 *
 * @accessibility
 * The `aria-label` or `aria-labelledby` prop is REQUIRED for icon-only buttons
 * to ensure screen readers can understand the button's purpose.
 */
type IconButtonOptions = {
  /**
   * Optional href for navigation icon buttons
   * @see {@link https://nextjs.org/docs/app/api-reference/components/link Next.js Link}
   * @see {@link https://yamada-ui.com/components/navigation/link Yamada UI Link}
   */
  href?: string
  /**
   * Optional target for navigation icon buttons
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target}
   */
  target?: string
}

export type IconButtonProps = UIIconButtonProps & IconButtonOptions

/**
 * IconButton component for displaying icon-only buttons based on Yamada UI IconButton
 *
 * @param props - Combined Yamada UI IconButton props and custom options
 * @returns A memoized icon button component
 *
 * @example
 * // Standard icon button with accessibility
 * <IconButton aria-label="Add item" icon={<PlusIcon />} />
 *
 * @example
 * // Navigation icon button
 * <IconButton as="a" href="/settings" aria-label="Settings" icon={<SettingsIcon />} />
 *
 * @example
 * // Different variants and sizes
 * <IconButton
 *   variant="outline"
 *   size="lg"
 *   colorScheme="primary"
 *   aria-label="Delete"
 *   icon={<TrashIcon />}
 * />
 *
 * @example
 * // Loading state
 * <IconButton
 *   loading
 *   aria-label="Save"
 *   icon={<SaveIcon />}
 * />
 */
export const IconButton = memo(
  forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
    const { size = "md" } = props

    const iconButtonStyles: HTMLUIProps<"button"> = useMemo(
      () => ({
        aspectRatio: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        h: "auto",
        ...(!Object.hasOwn(styles, size as keyof typeof styles) && styles.base),
        ...(styles[size as keyof typeof styles] ?? {}),
      }),
      [size],
    )

    return <UIIconButton ref={ref} {...iconButtonStyles} {...props} />
  }),
)

IconButton.displayName = "IconButton"
