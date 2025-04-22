'use client'

import { ArrowLeftIcon } from '@yamada-ui/lucide'
import { HStack, IconButton } from '@yamada-ui/react'

import { Heading } from '@/components/Generic/Heading'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, useCallback, useContext } from 'react'
import { OriginContext } from './providers/OriginTracker'

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
        <Heading.h1 fontSize="lg" fontWeight="medium" lineHeight="none" color="tertiary">
          {title}
        </Heading.h1>
      </HStack>
      {children}
    </HStack>
  )
}
