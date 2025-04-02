'use client'

import { memo, type PropsWithChildren } from 'react'

import type { ButtonProps } from './ui/button'
import { Button } from './ui/button'

export const LogOutButton = memo(
  ({ children, size = 'icon', variant = 'ghost' }: PropsWithChildren<ButtonProps>) => (
    <Button
      size={size}
      variant={variant}
      onClick={() => {
        throw new Error('Log Out Button Not Implemented')
      }}
    >
      {children}
    </Button>
  ),
)

LogOutButton.displayName = 'LogOutButton'
