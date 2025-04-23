import { DownloadIcon } from "@yamada-ui/lucide"
import { Button, HStack, Heading, Skeleton, Spacer, Text, VStack } from "@yamada-ui/react"
import { memo } from "react"

export const Loading = memo(() => {
  return (
    <VStack>
      <HStack w="full">
        <Heading>Attendees</Heading>
        <Spacer />
        <Button
          display={{ base: "inline-flex", md: "none" }}
          variant="outline"
          disabled
          startIcon={<DownloadIcon />}
        >
          Download as CSV
        </Button>
      </HStack>
      <Skeleton>
        <Text>
          Here&apos;s the attendee list for the session on{" "}
          <Text as="strong">Wednesday 1st January 2025</Text>
        </Text>
      </Skeleton>
      <Skeleton h="400px" w="full" /> {/* For Attendees table */}
    </VStack>
  )
})

Loading.displayName = "Loading"
