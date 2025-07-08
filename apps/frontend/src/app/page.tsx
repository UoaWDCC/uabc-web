import { FAQ } from "@repo/ui/components/Generic"
import { Container } from "@yamada-ui/react"
import { getFaq } from "@/lib/api/endpoints"

export default async function Home() {
  const faq = await getFaq()

  return (
    <Container as="main">
      <FAQ items={faq.questions} />
    </Container>
  )
}
