'use client'

import React from 'react'

import { BackNavigationBar } from '@/components/BackNavigationBar'
import { Heading } from '@/components/Heading'
import { Attendees, Loading } from '@/components/admin/view-sessions/gameSessionId'
import { useGameSessionId } from '@/hooks/query/game-sessions'
import { formatFullDate } from '@/lib/utils/dates'
import { DownloadIcon } from '@yamada-ui/lucide'
import {
  Button,
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
  HStack,
  Spacer,
  Text,
  VStack,
  useNotice,
} from '@yamada-ui/react'

export default function ClientViewSessionsPageWithId({ gameSessionId }: { gameSessionId: number }) {
  const { data, isLoading } = useGameSessionId(gameSessionId)
  const date = data?.date
  const notice = useNotice()

  if (isLoading) {
    return (
      <>
        <BackNavigationBar title="Download Attendees List" pathName="/admin/view-sessions" />
        <Loading />
      </>
    )
  }

  if (!data) {
    return (
      <>
        <BackNavigationBar title="Download Attendees List" pathName="/admin/view-sessions" />
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
      throw new Error('Failed to download attendees list')
    }
    const fileContents = await res.blob()
    const a = document.createElement('a')
    const url = URL.createObjectURL(fileContents)
    a.href = url
    a.download = `${formatFullDate(date!)} attendees list.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDownloadcsv() {
    try {
      await downloadAttendeesList()
    } catch {
      notice({ title: 'Uh oh! Something went wrong.', status: 'error' })
    }
  }

  return (
    <>
      <BackNavigationBar
        title={isLoading ? 'Loading...' : formatFullDate(date!).toLocaleString()}
        pathName="/admin/view-sessions"
      />
      <VStack>
        <HStack>
          <Heading>Attendees</Heading>
          <Spacer />
          <Button
            display={{ base: 'inline-flex', md: 'none' }}
            onClick={handleDownloadcsv}
            variant="outline"
            startIcon={<DownloadIcon />}
          >
            Download as CSV
          </Button>
        </HStack>
        <Text color="gray.500">
          Here&apos;s the attendee list for the session on{' '}
          <Text as="strong">
            {isLoading ? 'Loading...' : formatFullDate(date!).toLocaleString()}
          </Text>
        </Text>
        <Attendees gameSessionId={gameSessionId} />
      </VStack>
    </>
  )
}
