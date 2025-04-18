import type { CSSUIObject, HeadingProps as UIHeadingProps } from '@yamada-ui/react'
import { Heading as UIHeading } from '@yamada-ui/react'
import type { FC } from 'react'
import { memo, useMemo } from 'react'

export const FONT_SIZES: Record<string, string> = {
  h1: '3xl',
  h2: '2xl',
  h3: 'xl',
  h4: 'lg',
  h5: 'md',
  h6: 'sm',
}

export const FONT_WEIGHTS: Record<string, string> = {
  h1: 'bold',
  h2: 'bold',
  h3: 'bold',
  h4: 'semibold',
  h5: 'semibold',
  h6: 'semibold',
}

export type HeadingProps = UIHeadingProps & {
  as?: keyof typeof FONT_SIZES | keyof typeof FONT_WEIGHTS
}

export const Heading: FC<HeadingProps> = memo(({ children, as = 'h1', ...props }) => {
  const fontSize = FONT_SIZES[as] || '3xl'
  const fontWeight = FONT_WEIGHTS[as] || 'bold'

  const css: CSSUIObject = useMemo(
    () => ({
      fontSize,
      fontWeight,
    }),
    [fontSize, fontWeight],
  )

  return (
    <UIHeading as={as} __css={css} {...props}>
      {children}
    </UIHeading>
  )
})

Heading.displayName = 'Heading'
