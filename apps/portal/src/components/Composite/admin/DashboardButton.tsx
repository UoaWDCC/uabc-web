import { Button, type ButtonProps, Spacer } from "@yamada-ui/react"
import Link from "next/link"
import { ArrowRightIcon } from "../Icons"

interface DashboardButtonProps extends ButtonProps {
  href: string
}

export function DashboardButton({ children, href, ...props }: DashboardButtonProps) {
  return (
    <Button as={Link} colorScheme="primary" h="20" href={href} px="6" rounded="md" {...props}>
      {children}
      <Spacer />
      <ArrowRightIcon h="8" w="8" />
    </Button>
  )
}
