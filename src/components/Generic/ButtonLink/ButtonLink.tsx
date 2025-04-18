import Link from 'next/link'
import type { FC } from 'react'
import { Button, type ButtonProps } from '../Button'

type ButtonLinkOptions = {
  href?: string
}

export type ButtonLinkProps = ButtonProps & ButtonLinkOptions

export const ButtonLink: FC<ButtonLinkProps> = (props) => {
  return <Button as={Link} {...props} />
}
