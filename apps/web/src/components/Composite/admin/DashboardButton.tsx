import Link from 'next/link'
import React from 'react'

import { Button, type ButtonProps, Spacer } from '@yamada-ui/react'
import { ArrowRightIcon } from '../Icons'

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
