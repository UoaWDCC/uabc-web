/**
 * @author Angela Guo <aguo921@aucklanduni.ac.nz>
 */

import { type HeadingProps, Heading as UIHeading } from '@yamada-ui/react'
import type { FC } from 'react'

export const Heading: FC<HeadingProps> = ({ children, ...props }: HeadingProps) => (
  <UIHeading
    fontSize="3xl"
    fontWeight="bold"
    // className={cn('text-3xl font-bold tracking-tight', className)}
    {...props}
  >
    {children}
  </UIHeading>
)
