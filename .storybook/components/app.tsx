import { Center, Image, type CenterProps } from '@yamada-ui/react'
import type { FC } from 'react'

interface AppProps extends CenterProps {}

export const App: FC<AppProps> = ({ children, ...rest }) => {
  return (
    <Center
      h={{
        base: 'calc(100dvh - {spaces.lg} * 2)',
        md: 'calc(100dvh - {spaces.md} * 2)',
      }}
      w={{
        base: 'calc(100vw - {spaces.lg} * 2)',
        md: 'calc(100vw - {spaces.md} * 2)',
      }}
      {...rest}
    >
      {children ?? (
        <Image
          src="https://raw.githubusercontent.com/UoaWDCC/uabc-web/refs/heads/master/public/svgs/logo.svg"
          alt="UABC Logo"
          maxW="xl"
          w="full"
        />
      )}
    </Center>
  )
}
