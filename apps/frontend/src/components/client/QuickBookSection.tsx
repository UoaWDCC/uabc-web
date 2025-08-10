"use client"

import { mockSessions, type PlayLevel, Routes } from "@repo/shared"
import { QuickBook } from "@repo/ui/components/Generic"
import { useAuthNavigation, useQuickBookStorage } from "@repo/ui/hooks"
import { Container } from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export const QuickBookSection = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { setValue: setQuickBookData } = useQuickBookStorage()
  const { buildLoginUrl } = useAuthNavigation()

  const handleQuickBookSubmit = (formData: {
    locationAndTimeId: string
    skillLevel: PlayLevel
  }) => {
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
      <QuickBook onSubmit={handleQuickBookSubmit} sessions={mockSessions} />
    </Container>
  )
}
