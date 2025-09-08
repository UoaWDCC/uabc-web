import { use } from "react"
import { getLocationBubble } from "@/services/cms/location-bubble/LocationBubbleService"
import { LocationBubbleSection } from "../client/LocationBubbleSection"

/**
 * Server-side component to fetch and render the location bubble section.
 *
 * @returns A location bubble section component.
 */
export const LocationBubbleServerSection = () => {
  const { data: locationBubble } = use(getLocationBubble())

  return <LocationBubbleSection locationBubbleItems={locationBubble.locationBubbleItems} />
}
