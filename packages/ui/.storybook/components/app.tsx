import { Center, type CenterProps, Image } from "@yamada-ui/react"
import type { FC } from "react"

interface AppProps extends CenterProps {}

export const App: FC<AppProps> = ({ children, ...rest }) => {
  return (
    <Center
      h={{
        base: "calc(100dvh - {spaces.lg} * 2)",
        md: "calc(100dvh - {spaces.md} * 2)",
      }}
      w={{
        base: "calc(100vw - {spaces.lg} * 2)",
        md: "calc(100vw - {spaces.md} * 2)",
      }}
      {...rest}
    >
      {children ?? (
        <Image
          alt="UABC Logo"
          maxW="xl"
          src="https://raw.githubusercontent.com/UoaWDCC/uabc-web/refs/heads/master/public/svgs/logo.svg"
          w="full"
        />
      )}
    </Center>
  )
}
