import { AboutUsSection } from "@repo/ui/components/Composite"
import { Container } from "@yamada-ui/react"
import { use } from "react"
import { getAboutUsInfo } from "@/services/cms/about-us-info/AboutUsInfoService"

const mockItems = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
    alt: "Mountain Lake",
    width: 600,
    height: 400,
    emoji: "😄",
  },
  {
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600",
    alt: "Forest Path",
    width: 600,
    height: 400,
    emoji: "😁",
  },
  {
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600",
    alt: "Desert Dunes",
    width: 600,
    height: 400,
    emoji: "😆",
  },
]

/**
 * Server-side component to fetch and render the about us section.
 *
 * @returns A about us section component.
 */
export const AboutUsServerSection = () => {
  const { data: aboutUsItems } = use(getAboutUsInfo())

  return (
    <Container centerContent layerStyle="container">
      <AboutUsSection cards={aboutUsItems.items} items={mockItems} />
    </Container>
  )
}
