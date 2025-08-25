"use client"
import {
  dataAttr,
  type HTMLUIProps,
  Loading,
  type LoadingProps,
  omitThemeProps,
  type ThemeProps,
  ui,
  useComponentStyle,
} from "@yamada-ui/react"
import { forwardRef, memo, useMemo } from "react"

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
  /**
   * The icon to display in the button
   */
  icon?: React.ReactNode
  /**
   * If `true`, the button is loading.
   */
  loading?: boolean
  /**
   * The icon to display when the button is loading.
   */
  loadingIcon?: LoadingProps["variant"] | React.ReactNode
  /**
   * If `true`, the button is active.
   */
  active?: boolean
}

export interface IconButtonProps
  extends HTMLUIProps<"button">,
    ThemeProps<"IconButton">,
    IconButtonOptions {}

const loadingVariants = ["dots", "grid", "audio", "circles", "oval", "puff", "rings"] as const

type LoadingVariant = (typeof loadingVariants)[number]

const isLoadingVariant = (value: string): value is LoadingVariant =>
  (loadingVariants as readonly string[]).includes(value)

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
  forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, loadingIcon, loading, active, children, ...props }, ref) => {
      const [styles, mergedProps] = useComponentStyle("IconButton", {
        ...props,
      })

      const rest = omitThemeProps(mergedProps)

      const element = useMemo(() => {
        if (typeof loadingIcon === "string") {
          if (isLoadingVariant(loadingIcon)) {
            return <Loading color="current" variant={loadingIcon} />
          }
          return <Loading color="current" />
        }
        return loadingIcon || <Loading color="current" />
      }, [loadingIcon])

      return (
        <ui.button __css={styles} data-active={dataAttr(active)} ref={ref} {...rest}>
          {loading ? element : icon || children}
        </ui.button>
      )
    },
  ),
)

IconButton.displayName = "IconButton"
