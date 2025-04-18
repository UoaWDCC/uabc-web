'use client'

import { PlusIcon } from '@yamada-ui/lucide'
import { IconButton, useDisclosure } from '@yamada-ui/react'
import React, { memo } from 'react'
import { CreateSemesterFormDialog } from './CreateSemesterFormDialog'

const UnmemoizedSemesterCreateButton = () => {
  const { open, onClose, onOpen } = useDisclosure()
  return (
    <>
      <IconButton variant="solid" colorScheme="primary" onClick={onOpen}>
        <PlusIcon />
      </IconButton>
      <CreateSemesterFormDialog open={open} onClose={onClose} />
    </>
  )
}

export default memo(UnmemoizedSemesterCreateButton)
