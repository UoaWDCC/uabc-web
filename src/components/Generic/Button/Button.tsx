import {
  type HTMLUIProps,
  omitThemeProps,
  type ThemeProps,
  ui,
  useComponentStyle,
} from '@yamada-ui/react'
import type { FC } from 'react'

// it should be {} but needs to be object type for linting
type ButtonOptions = object

export type ButtonProps = HTMLUIProps<'button'> & ThemeProps<'Button'> & ButtonOptions

// // https://yamada-ui.com/styled-system/theming/component-styles
export const Button: FC<ButtonProps> = (props) => {
  const [styles, mergedProps] = useComponentStyle('Button', props)
  const rest = omitThemeProps(mergedProps)

  return <ui.button __css={styles} {...rest} />
}
