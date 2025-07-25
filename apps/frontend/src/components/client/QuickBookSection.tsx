import { locationAndTimeOptionsMock, QuickBook } from "@repo/ui/components/Generic"
import { Container } from "@yamada-ui/react"

export const QuickBookSection = () => {
  return (
    <Container centerContent layerStyle="container" zIndex="nappa">
      <QuickBook locationAndTimeOptions={locationAndTimeOptionsMock} />
    </Container>
  )
}
