import { Heading } from "@repo/ui/components/Primitive"
import { Card, CardBody, CardHeader, Text } from "@yamada-ui/react"

/**
 * Component to display a message indicating that the admin view is not available on mobile devices.
 *
 * @returns A card with a message about the unavailability of the admin view on mobile.
 * @example <AdminNotAvailableCard />
 */
export const AdminNotAvailableCard = () => {
  return (
    <Card
      align="center"
      bgColor="secondary.800"
      borderRadius="3xl"
      layerStyle="gradientBorder"
      p="sm"
    >
      <CardHeader>
        <Heading.h2 color="primary" fontSize="2xl" fontWeight="bold" textAlign="center">
          Admin View Not Available on Mobile
        </Heading.h2>
      </CardHeader>
      <CardBody>
        <Text fontSize="sm" textAlign="center">
          Currently Admin view and its features is only available on desktop screen sizes. Please
          switch to be able to use admin features.
        </Text>
      </CardBody>
    </Card>
  )
}
