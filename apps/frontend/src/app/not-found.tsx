import { NotFoundCard } from "@repo/ui/components/Generic/NotFoundCard"
import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Not Found",
  description:
    "The page you are looking for does not exist. Please check the URL or return to the homepage.",
}

/**
 * A 404 Not Found page component for when a page is not found at the specified route.
 *
 * @returns A 404 Not Found page with a message and a button to return home.
 */
export default function NotFound() {
  return (
    <VStack as="main">
      <NotFoundCard />
    </VStack>
  )
}
