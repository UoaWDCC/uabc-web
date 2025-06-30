"use client"

import { Heading } from "@repo/ui/components/Heading"
import { DownloadIcon } from "@yamada-ui/lucide"
import {
  Button,
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
  HStack,
  Spacer,
  Text,
  useNotice,
  VStack,
} from "@yamada-ui/react"
import { Attendees, Loading } from "@/components/Composite/admin/view-sessions/gameSessionId"
import { BackNavigationBar } from "@/components/Composite/BackNavigationBar"
import { useGameSessionId } from "@/hooks/query/game-sessions"
import { formatFullDate } from "@/lib/utils/dates"

export default function ClientViewSessionsPageWithId({ gameSessionId }: { gameSessionId: number }) {
  const { data, isLoading } = useGameSessionId(gameSessionId)
  const date = data?.date
  const notice = useNotice()

  if (isLoading) {
    return (
      <>
        <BackNavigationBar pathName="/admin/view-sessions" title="Download Attendees List" />
        <Loading />
      </>
    )
  }

  if (!data) {
    return (
      <>
        <BackNavigationBar pathName="/admin/view-sessions" title="Download Attendees List" />
        <EmptyState>
          <EmptyStateTitle>No data available</EmptyStateTitle>
          <EmptyStateDescription>
            The game session data is currently unavailable.
          </EmptyStateDescription>
        </EmptyState>
      </>
    )
  }

  async function downloadAttendeesList() {
    const res = await fetch(`/api/game-sessions/${gameSessionId}/download`)
    if (!res.ok) {
      throw new Error("Failed to download attendees list")
    }
    const fileContents = await res.blob()
    const a = document.createElement("a")
    const url = URL.createObjectURL(fileContents)
    a.href = url
    a.download = `${date ? formatFullDate(date) : "unknown-date"} attendees list.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDownloadcsv() {
    try {
      await downloadAttendeesList()
    } catch {
      notice({ title: "Uh oh! Something went wrong.", status: "error" })
    }
  }

  return (
    <>
      <BackNavigationBar
        pathName="/admin/view-sessions"
        title={
          isLoading ? "Loading..." : date ? formatFullDate(date).toLocaleString() : "Unknown Date"
        }
      />
      <VStack>
        <HStack>
          <Heading>Attendees</Heading>
          <Spacer />
          <Button
            display={{ base: "inline-flex", md: "none" }}
            onClick={handleDownloadcsv}
            startIcon={<DownloadIcon />}
            variant="outline"
          >
            Download as CSV
          </Button>
        </HStack>
        <Text color="gray.500">
          Here&apos;s the attendee list for the session on{" "}
          <Text as="strong">
            {isLoading
              ? "Loading..."
              : date
                ? formatFullDate(date).toLocaleString()
                : "Unknown Date"}
          </Text>
        </Text>
        <Attendees gameSessionId={gameSessionId} />
      </VStack>
    </>
  )
}
