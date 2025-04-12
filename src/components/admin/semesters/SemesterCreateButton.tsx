'use client'

import React from 'react'
import { PlusIcon } from '@yamada-ui/lucide'
import { IconButton, useDisclosure } from '@yamada-ui/react'
import { CreateSemesterFormDialog } from './CreateSemesterFormDialog'

const SemesterCreateButton = () => {
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

export default SemesterCreateButton
