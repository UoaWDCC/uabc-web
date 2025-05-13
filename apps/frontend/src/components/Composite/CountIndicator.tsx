import type { PropsWithChildren } from "react"

import { Center, type CenterProps } from "@yamada-ui/react"

// interface CountIndicatorProps extends CenterProps {
//   children: ReactNode
// }

export function CountIndicator({ children, ...props }: PropsWithChildren<CenterProps>) {
  return (
    <Center
      backgroundColor="tertiary.100"
      borderRadius="md"
      fontWeight="semibold"
      height={8}
      minWidth={8}
      padding={2}
      {...props}
    >
      {children}
    </Center>
  )
}
