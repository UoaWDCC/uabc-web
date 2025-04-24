"use client"

import { PlusIcon } from "@yamada-ui/lucide"
import { IconButton, useDisclosure } from "@yamada-ui/react"
import { memo } from "react"
import { CreateScheduleFormDialog } from "./CreateScheduleFormDialog"

interface ScheduleCreateButtonProps {
  semesterId: number
}

const UnmemoizedScheduleCreateButton = ({ semesterId }: ScheduleCreateButtonProps) => {
  const { open, onClose, onOpen } = useDisclosure()
  return (
    <>
      <IconButton colorScheme="primary" onClick={onOpen} variant="solid">
        <PlusIcon />
      </IconButton>
      <CreateScheduleFormDialog onClose={onClose} open={open} semesterId={semesterId} />
    </>
  )
}

export default memo(UnmemoizedScheduleCreateButton)
