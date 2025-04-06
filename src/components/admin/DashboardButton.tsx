import React from 'react'
import Link from 'next/link'

import { ArrowRightIcon } from '../Icons'
import { Button, Spacer, type ButtonProps } from '@yamada-ui/react'

interface DashboardButtonProps extends ButtonProps {
  href: string
}

export function DashboardButton({ children, href, ...props }: DashboardButtonProps) {
  return (
    <Button as={Link} href={href} colorScheme="primary" rounded="md" h="20" px="6" {...props}>
      {children}
      <Spacer />
      <ArrowRightIcon h="8" w="8" />
    </Button>
  )
}
