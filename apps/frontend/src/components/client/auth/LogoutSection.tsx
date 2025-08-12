import { Center, Loading, Text, VStack } from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"

export const LogoutSection = () => {
  const router = useRouter()
  const { logout, isLoading, isPending } = useAuth()
  const loggedOut = useRef(false)

  useEffect(() => {
    if (!isLoading && !isPending && !loggedOut.current) {
      loggedOut.current = true
      logout()
      router.push("/")
    }
  }, [logout, router, isLoading, isPending])

  return (
    <Center as={VStack} gap="lg" layerStyle="container">
      <Loading fontSize="5xl" />
      <Text>Logging you out...</Text>
    </Center>
  )
}
