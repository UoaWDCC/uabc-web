"use client"

import { Heading } from "@repo/ui/components/Heading"
import { ArrowLeftIcon } from "@yamada-ui/lucide"
import { HStack, IconButton } from "@yamada-ui/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type ReactNode, useCallback, useContext } from "react"
import { OriginContext } from "./providers/OriginTracker"

interface BackNavigationBarProps {
  title: string
  pathName: string
  className?: string
  children?: ReactNode
}

export const BackNavigationBar = ({
  title,
  pathName,
  children,
  ...props
}: BackNavigationBarProps) => {
  const router = useRouter()
  const isWithinPage = useContext(OriginContext)

  const handleBackButtonClick = useCallback(() => {
    if (isWithinPage) router.back()
    else router.push(pathName)
  }, [isWithinPage, pathName, router])

  return (
    <HStack w="full">
      <HStack>
        <IconButton
          as={!isWithinPage ? Link : undefined}
          colorScheme="tertiary"
          h={8}
          href={!isWithinPage ? pathName : undefined}
          minW={8}
          onClick={handleBackButtonClick}
          p={2}
          variant="ghost"
          w={8}
          {...props}
        >
          <ArrowLeftIcon boxSize={6} />
        </IconButton>
        <Heading.h1 color="tertiary" fontSize="lg" fontWeight="medium" lineHeight="none">
          {title}
        </Heading.h1>
      </HStack>
      {children}
    </HStack>
  )
}
