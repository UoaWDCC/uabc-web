"use client"

import { Button, VStack } from "@yamada-ui/react"
import { useState } from "react"
import { AdminSemesterFlow } from "./AdminSemesterFlow"

export const AdminSemesterSection = () => {
  const [isCreating, setIsCreating] = useState(false)

  return (
    // Just a simple section with a button to start creating a new semester
    <VStack alignItems="flex-start" as="section" w="full">
      {isCreating ? (
        <AdminSemesterFlow onCancel={() => setIsCreating(false)} />
      ) : (
        <Button colorScheme="primary" onClick={() => setIsCreating(true)}>
          Create new Semester
        </Button>
      )}
    </VStack>
  )
}
