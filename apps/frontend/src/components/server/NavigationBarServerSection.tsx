import { use } from "react"
import { getNavigationBar } from "@/services/cms/navbar/NavigationBarService"
import { NavbarSection } from "../client/NavbarSection"

/**
 * Server-side component to fetch and render the navigation bar section.
 *
 * @returns A navigation bar section component.
 */
export const NavigationBarServerSection = () => {
  const { data: navbar } = use(getNavigationBar())

  return <NavbarSection {...navbar} />
}
