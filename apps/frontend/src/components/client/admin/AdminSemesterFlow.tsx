"use client"

import { Button, Heading, Input, VStack } from "@yamada-ui/react"
import { useReducer } from "react"
import { createAdminSemesterFlowReducer, initialState } from "./adminSemesterFlowReducer"

export const AdminSemesterFlow = ({ onCancel }: { onCancel: () => void }) => {
  const AdminSemesterFlowReducer = createAdminSemesterFlowReducer()

  const [state, dispatch] = useReducer(AdminSemesterFlowReducer, initialState)

  const handleNext = () => dispatch({ type: "NEXT_STEP" })
  const handleBack = () => dispatch({ type: "PREV_STEP" })
  const handleCancel = () => onCancel()
  const handleSetName = (name: string) => dispatch({ type: "SET_NAME", payload: name })

  // Those dates will need to be converted to Date objects in the future
  const handleSetStartDate = (date: string) => dispatch({ type: "SET_START_DATE", payload: date })
  const handleSetEndDate = (date: string) => dispatch({ type: "SET_END_DATE", payload: date })
  const handleSetBreakStartDate = (date: string) =>
    dispatch({ type: "SET_BREAK_START_DATE", payload: date })
  const handleSetBreakEndDate = (date: string) =>
    dispatch({ type: "SET_BREAK_END_DATE", payload: date })

  return (
    <>
      {state.step === "name" ? (
        <VStack flex={1} gap="lg" textAlign="center">
          {/* Placeholder for semester name */}
          <Heading size="md">Semester Name</Heading>
          <Input
            onChange={(e) => handleSetName(e.target.value)}
            placeholder="Enter Semester Name"
            value={state.name}
          />
          <Button onClick={handleCancel}>Cancel</Button>
          <Button colorScheme="primary" disabled={!state.name.trim()} onClick={handleNext}>
            Next
          </Button>
        </VStack>
      ) : state.step === "dates" ? (
        <VStack flex={1} gap="lg" textAlign="center">
          <Heading size="md">Semester Start & End</Heading>
          <Input
            onChange={(e) => handleSetStartDate(e.target.value)}
            placeholder="Start Date"
            type="date"
            value={state.startDate}
          />
          <Input
            onChange={(e) => handleSetEndDate(e.target.value)}
            placeholder="End Date"
            type="date"
            value={state.endDate}
          />
          <Button onClick={handleBack}>Back</Button>
          <Button
            colorScheme="primary"
            disabled={!state.startDate || !state.endDate}
            onClick={handleNext}
          >
            Next
          </Button>
        </VStack>
      ) : state.step === "breaks" ? (
        <VStack flex={1} gap="lg" textAlign="center">
          <Heading size="md">Semester Break Start & End</Heading>
          <Input
            onChange={(e) => handleSetBreakStartDate(e.target.value)}
            placeholder="Break Start Date"
            type="date"
            value={state.breakStartDate}
          />
          <Input
            onChange={(e) => handleSetBreakEndDate(e.target.value)}
            placeholder="Break End Date"
            type="date"
            value={state.breakEndDate}
          />
          <Button onClick={handleBack}>Back</Button>
          <Button
            colorScheme="primary"
            disabled={!state.breakStartDate || !state.breakEndDate}
            onClick={handleNext}
          >
            Create Semester
          </Button>
        </VStack>
      ) : state.step === "success" ? (
        <VStack flex={1} gap="lg" textAlign="center">
          <Heading size="md">Confirmation</Heading>
          <p>Semester Created Successfully!</p>
          <p>Name: {state.name}</p>
          <p>Start Date: {state.startDate}</p>
          <p>End Date: {state.endDate}</p>
          <p>Break Start: {state.breakStartDate}</p>
          <p>Break End: {state.breakEndDate}</p>
          <Button onClick={handleCancel}>Close</Button>
        </VStack>
      ) : null}
    </>
  )
}
