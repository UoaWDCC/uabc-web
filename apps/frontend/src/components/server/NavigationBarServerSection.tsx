import { NavigationBar } from "@repo/ui/components/Generic"
import { use } from "react"
import { getNavigationBar } from "@/services/cms/navbar/NavigationBarService"

/**
 * Server-side component to fetch and render the navigation bar section.
 *
 * @returns A navigation bar section component.
 */
export const NavigationBarServerSection = () => {
  const { data: navbar } = use(getNavigationBar())

  return <NavigationBar {...navbar} />
}
