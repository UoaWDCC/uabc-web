import { Button as UIButton, type ButtonProps as UIButtonProps } from '@yamada-ui/react'
import { type FC, forwardRef } from 'react'

// it should be {} but needs to be object type for linting
type ButtonOptions = object

export type ButtonProps = UIButtonProps & ButtonOptions

// // https://yamada-ui.com/styled-system/theming/component-styles
export const Button: FC<ButtonProps> = forwardRef((props, ref) => {
  return <UIButton ref={ref} {...props} />
})

Button.displayName = 'Button'
