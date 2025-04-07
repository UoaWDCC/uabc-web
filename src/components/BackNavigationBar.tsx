'use client'

import { useCallback, useContext, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@yamada-ui/lucide'
import { HStack, IconButton, Text } from '@yamada-ui/react'

import { OriginContext } from './providers/OriginTracker'
import Link from 'next/link'

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
          variant="ghost"
          as={!isWithinPage ? Link : undefined}
          href={!isWithinPage ? pathName : undefined}
          p={2}
          minW={8}
          h={8}
          w={8}
          onClick={handleBackButtonClick}
          colorScheme="tertiary"
          {...props}
        >
          <ArrowLeftIcon boxSize={6} />
        </IconButton>
        <Text fontSize="lg" fontWeight="medium" lineHeight="none" color="tertiary">
          {title}
        </Text>
      </HStack>
      {children}
    </HStack>
  )
}
