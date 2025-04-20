import type { As, CSSUIObject, HeadingProps as UIHeadingProps } from '@yamada-ui/react'
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

export interface HeadingProps extends Omit<UIHeadingProps, 'as'> {
  as?: string
}

export const Heading: FC<HeadingProps> = memo(({ children, as = 'h1', ...props }) => {
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
    <UIHeading as={as as As} __css={css} {...props}>
      {children}
    </UIHeading>
  )
})

Heading.displayName = 'Heading'
