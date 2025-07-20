import { NavigationBar } from "@repo/ui/components/Generic"
import { use } from "react"
import { getNavigationBar } from "@/services/cms/navbar/NavigationBarService"

/**
 * Component to server-side fetch and render the navigation bar section using Tanstack Query.
 *
 * @returns Server-side component to fetch and render the navigation bar section using Tanstack Query.
 */
export const NavigationBarServerSection = () => {
  const { data: navbar } = use(getNavigationBar())

  return <NavigationBar {...navbar} />
}
