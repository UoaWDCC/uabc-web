"use client"
import { NavigationBar } from "@repo/ui/components/Generic"
import { Text } from "@yamada-ui/react"
import { useNavigationBar } from "@/services/cms/navbar/NavigationBarQuery"

/**
 * Client-side component to fetch and render the navigation bar section.
 *
 * @returns A navigation bar component with links to different pages, an admin link if the user is an admin, and a user menu if the user is signed in.
 */
export default function NavigationBarSection() {
  const { data: navbarResponseData, isError, isLoading } = useNavigationBar()

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (isError || !navbarResponseData) {
    return <Text>ERROR</Text>
  }

  if (!navbarResponseData?.id) {
    return <Text>ERROR: NavigationBar data missing id</Text>
  }
  return <NavigationBar {...navbarResponseData} id={navbarResponseData.id} />
}
