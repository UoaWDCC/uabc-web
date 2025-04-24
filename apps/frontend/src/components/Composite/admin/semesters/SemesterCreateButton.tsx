"use client"

import { PlusIcon } from "@yamada-ui/lucide"
import { IconButton, useDisclosure } from "@yamada-ui/react"
import React, { memo } from "react"
import { CreateSemesterFormDialog } from "./CreateSemesterFormDialog"

const UnmemoizedSemesterCreateButton = () => {
  const { open, onClose, onOpen } = useDisclosure()
  return (
    <>
      <IconButton colorScheme="primary" onClick={onOpen} variant="solid">
        <PlusIcon />
      </IconButton>
      <CreateSemesterFormDialog onClose={onClose} open={open} />
    </>
  )
}

export default memo(UnmemoizedSemesterCreateButton)
