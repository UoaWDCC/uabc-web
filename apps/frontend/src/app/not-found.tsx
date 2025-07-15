import { NotFoundCard } from "@repo/ui/components/Generic/NotFoundCard"
import type { Metadata } from "next"
import { generateMetadata } from "@/lib/utils/metadata"

export const metadata: Metadata = generateMetadata(
  "Not Found",
  "The page you are looking for does not exist. Please check the URL or return to the homepage.",
  "/404",
)

/**
 * A 404 Not Found page component for when a page is not found at the specified route.
 *
 * @returns A 404 Not Found page with a message and a button to return home.
 */
export default function NotFound() {
  return <NotFoundCard />
}
