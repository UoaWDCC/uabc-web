"use client"

import { type QuickBookFormData, Routes } from "@repo/shared"
import { QuickBook, QuickBookSkeleton } from "@repo/ui/components/Generic"
import { useAuthNavigation, useQuickBookStorage } from "@repo/ui/hooks"
import { Container } from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { mapGameSessionsToSessionItems } from "@/services/game-session/GameSessionAdapter"
import { useGetCurrentAvailableGameSessions } from "@/services/game-session/GameSessionQueries"

export const QuickBookSection = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { setValue: setQuickBookData } = useQuickBookStorage()
  const { buildLoginUrl } = useAuthNavigation()
  const { data, isLoading } = useGetCurrentAvailableGameSessions()

  const sessions = data.availableSessions
    ? mapGameSessionsToSessionItems(data.availableSessions)
    : []

  const handleQuickBookSubmit = (formData: QuickBookFormData) => {
    // Save quick book data to localStorage
    setQuickBookData({
      formData,
      timestamp: new Date().toISOString(),
    })

    // If user is not authenticated, redirect to login with return URL
    if (!user) {
      const loginUrl = buildLoginUrl(Routes.BOOK)
      router.push(loginUrl)
      return
    }

    // If user is authenticated, redirect to book page
    router.push(Routes.BOOK)
  }

  return (
    <Container centerContent layerStyle="container" zIndex="nappa">
      {isLoading ? (
        <QuickBookSkeleton />
      ) : (
        <QuickBook onSubmit={handleQuickBookSubmit} sessions={sessions} />
      )}
    </Container>
  )
}
