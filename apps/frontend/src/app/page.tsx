import { FAQ } from "@repo/ui/components/Generic"
import { Container } from "@yamada-ui/react"
import { getFaq } from "@/lib/api/endpoints"

// TODO: Implement actual homepage
export default async function Home() {
  //  TODO: Discuss with team if we want to fail the build if faq is not found
  const { data: faq } = await getFaq()

  return (
    <Container as="main">
      <FAQ items={faq?.data?.questions ?? []} />
    </Container>
  )
}
