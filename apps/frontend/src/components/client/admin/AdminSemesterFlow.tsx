"use client"

import { Button, Heading, Input, VStack } from "@yamada-ui/react"
import { useReducer, useState } from "react"
import { createAdminSemesterFlowReducer, initialState } from "./adminSemesterFlowReducer"

export const AdminSemesterFlow = ({ onCancel }: { onCancel: () => void }) => {
  const AdminSemesterFlowReducer = createAdminSemesterFlowReducer()

  const [state, dispatch] = useReducer(AdminSemesterFlowReducer, initialState)
  const [tempName, setTempName] = useState("")

  const handleNameConfirm = () => {
    dispatch({ type: "SET_NAME", payload: tempName })
    dispatch({ type: "NEXT_STEP" })
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <VStack gap="lg">
      {state.step === "details" && (
        <>
          <Heading size="md">Enter Semester Name</Heading>
          {/* Placeholder for your Card component */}
          <VStack>
            <Input
              onChange={(e) => setTempName(e.target.value)}
              placeholder="e.g., Fall 2025"
              value={tempName}
            />
            <Button onClick={handleCancel}>Cancel</Button>
            <Button colorScheme="primary" onClick={handleNameConfirm}>
              Confirm
            </Button>
          </VStack>
        </>
      )}
      {/* Other steps will go here */}
    </VStack>
  )
}
