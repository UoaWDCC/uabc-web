'use client'

import React, { memo } from 'react'
import { PlusIcon } from '@yamada-ui/lucide'
import { IconButton, useDisclosure } from '@yamada-ui/react'
import { CreateScheduleFormDialog } from './CreateScheduleFormDialog'

interface ScheduleCreateButtonProps {
  semesterId: number
}

const UnmemoizedScheduleCreateButton = ({ semesterId }: ScheduleCreateButtonProps) => {
  const { open, onClose, onOpen } = useDisclosure()
  return (
    <>
      <IconButton variant="solid" colorScheme="primary" onClick={onOpen}>
        <PlusIcon />
      </IconButton>
      <CreateScheduleFormDialog semesterId={semesterId} open={open} onClose={onClose} />
    </>
  )
}

export default memo(UnmemoizedScheduleCreateButton)
