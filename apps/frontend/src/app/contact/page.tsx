import { Container, VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { ContactSection } from "@/components/client/ContactSection"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the UABC team for general inquiries, bookings, and support.",
}

export default function Contact() {
  return (
    <VStack as="main">
      <Container centerContent layerStyle="container">
        <ContactSection />
      </Container>
    </VStack>
  )
}
