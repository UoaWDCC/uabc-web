import type { As, CSSUIObject, HeadingProps as UIHeadingProps } from '@yamada-ui/react'
import { Heading as UIHeading } from '@yamada-ui/react'
import type { ForwardRefRenderFunction } from 'react'
import { forwardRef, memo, useMemo } from 'react'

/**
 * Predefined font sizes for different heading levels
 *
 * @remarks
 * Maps heading levels to corresponding font sizes
 */
export const FONT_SIZES: Record<string, string> = {
  h1: '3xl',
  h2: '2xl',
  h3: 'xl',
  h4: 'lg',
  h5: 'md',
  h6: 'sm',
}

/**
 * Predefined font weights for different heading levels
 *
 * @remarks
 * Maps heading levels to corresponding font weights
 */
export const FONT_WEIGHTS: Record<string, string> = {
  h1: 'bold',
  h2: 'bold',
  h3: 'bold',
  h4: 'semibold',
  h5: 'semibold',
  h6: 'semibold',
}

/**
 * Props for the Heading component
 *
 * @remarks
 * Extends Yamada UI Heading props, with a customizable `as` prop
 *
 * @example
 * // Different heading levels
 * <Heading as="h2">Section Title</Heading>
 * <Heading as="h3">Subsection Title</Heading>
 */
export interface HeadingProps extends Omit<UIHeadingProps, 'as'> {
  /**
   * The HTML heading level
   *
   * @remarks
   * Determines the font size and weight
   * Must be one of 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
   *
   * @defaultValue 'h1'
   */
  as?: string
}

/**
 * A customizable heading component with dynamic font sizing and weight
 *
 * @param props - Heading component properties
 * @returns A memoized, forwarded heading component
 */
export const Heading: ForwardRefRenderFunction<HTMLHeadingElement, HeadingProps> = memo(
  forwardRef<HTMLHeadingElement, HeadingProps>(({ children, as = 'h1', ...props }, ref) => {
    const fontSize = FONT_SIZES[as] || '3xl'
    const fontWeight = FONT_WEIGHTS[as] || 'bold'

    if (!Object.keys(FONT_SIZES).includes(as)) {
      console.warn(`Invalid heading level "${as}". Falling back to "h1".`)
      as = 'h1'
    }

    const css: CSSUIObject = useMemo(
      () => ({
        fontSize,
        fontWeight,
      }),
      [fontSize, fontWeight],
    )

    return (
      <UIHeading ref={ref} as={as as As} __css={css} {...props}>
        {children}
      </UIHeading>
    )
  }),
)

Heading.displayName = 'Heading'
