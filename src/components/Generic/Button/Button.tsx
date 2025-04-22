import {
  Component,
  Link,
  Button as UIButton,
  type ButtonProps as UIButtonProps,
} from '@yamada-ui/react'
import { type ComponentPropsWithoutRef, type ElementType, type FC, forwardRef } from 'react'
import React from 'react'

// Re-evaluate the ButtonProps to conditionally include props from the 'as' component
export type ButtonProps<As extends ElementType = 'button'> = {
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  as?: As
} & UIButtonProps & // Include the original UIButtonProps
  Omit<ComponentPropsWithoutRef<As>, keyof UIButtonProps | 'as' | 'children'> // Include props from the 'as' component,
// omitting those already present in UIButtonProps and some common ones

// Define the type for the polymorphic component using forwardRef
export type PolymorphicRef<T extends ElementType> = React.ComponentPropsWithRef<T>['ref']

export type PolymorphicComponentProps<T extends ElementType, Props = {}> = Props &
  Omit<React.ComponentPropsWithoutRef<T>, keyof Props>

export interface ButtonComponent {
  <As extends ElementType = 'button'>(
    props: ButtonProps<As> & { ref?: PolymorphicRef<As> },
  ): React.ReactElement | null
  displayName?: string
}

export const Button = forwardRef(function Button<As extends ElementType = 'button'>(
  { as, children, type, ...rest }: ButtonProps<As>,
  ref?: React.Ref<HTMLButtonElement>,
) {
  const Component = as || 'button'

  return (
    <UIButton
      type={Component === 'button' ? type || 'button' : undefined}
      as={Component}
      ref={ref}
      {...rest}
    >
      {children}
    </UIButton>
  )
}) as ButtonComponent

Button.displayName = 'Button'
