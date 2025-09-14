import { Routes } from "@repo/shared/enums/routes"
import { Center, Loading } from "@yamada-ui/react"
import { redirect } from "next/navigation"

export default function Admin() {
  redirect(Routes.ADMIN_MEMBERS)

  return (
    <Center layerStyle="container">
      <Loading fontSize="4xl" />
    </Center>
  )
}
