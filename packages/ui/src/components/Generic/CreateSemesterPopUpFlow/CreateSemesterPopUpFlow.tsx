import type { SemesterNamePopUpValues } from "@repo/shared"
import { memo, useReducer } from "react"
import { SemesterCreatedPopUp } from "./SemesterCreatedPopUp"
import { SemesterDatePopUp } from "./SemesterDatePopUp"
import { SemesterNamePopUp } from "./SemesterNamePopUp"

interface SemesterFlowState {
  step: number
  semesterName?: string
  semesterDates?: { startDate: string; endDate: string }
  breakDates?: { startDate: string; endDate: string }
}

const initialState: SemesterFlowState = {
  step: 0,
}

type SemesterFlowAction =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SET_SEMESTER_NAME"; payload: string }
  | { type: "SET_SEMESTER_DATES"; payload: { startDate: string; endDate: string } }
  | { type: "SET_BREAK_DATES"; payload: { startDate: string; endDate: string } }
  | { type: "RESET" }

const reducer = (state: SemesterFlowState, action: SemesterFlowAction): SemesterFlowState => {
  switch (action.type) {
    case "NEXT":
      return {
        ...state,
        step: state.step + 1,
      }
    case "PREV":
      return {
        ...state,
        step: state.step - 1,
      }
    case "SET_SEMESTER_NAME":
      return {
        ...state,
        semesterName: action.payload,
      }
    case "SET_SEMESTER_DATES":
      return {
        ...state,
        semesterDates: action.payload,
      }
    case "SET_BREAK_DATES":
      return {
        ...state,
        breakDates: action.payload,
      }
    case "RESET":
      return initialState
    default:
      return state
  }
}

/**
 * Props for the CreateSemesterPopUpFlow component.
 */
interface CreateSemesterPopUpFlowProps {
  /**
   * Whether the flow popup is open or not.
   * @default false
   */
  open: boolean

  /**
   * Handler called when the flow is completed or cancelled.
   */
  onClose?: () => void

  /**
   * Callback function to handle the completion of the semester creation flow.
   */
  onComplete?: (data: {
    semesterName: string
    semesterDates: { startDate: string; endDate: string }
    breakDates: { startDate: string; endDate: string }
  }) => void
}

/**
 * CreateSemesterPopUpFlow component that manages the multi-step semester creation process.
 *
 * @param open Whether the flow popup is open
 * @param onClose Handler called when the flow is cancelled
 * @param onComplete Callback function to handle the completion of the semester creation flow
 * @returns The CreateSemesterPopUpFlow component with all steps
 */
export const CreateSemesterPopUpFlow = memo(
  ({ open, onClose, onComplete }: CreateSemesterPopUpFlowProps) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const handleSemesterNameSubmit = (data: SemesterNamePopUpValues) => {
      dispatch({ type: "SET_SEMESTER_NAME", payload: data.name })
      dispatch({ type: "NEXT" })
    }

    const handleSemesterDatesSubmit = (data: { startDate: string; endDate: string }) => {
      dispatch({ type: "SET_SEMESTER_DATES", payload: data })
      dispatch({ type: "NEXT" })
    }

    const handleBreakDatesSubmit = (data: { startDate: string; endDate: string }) => {
      dispatch({ type: "SET_BREAK_DATES", payload: data })
      dispatch({ type: "NEXT" })
    }

    const handleBack = () => {
      dispatch({ type: "PREV" })
    }

    const handleClose = () => {
      dispatch({ type: "RESET" })
      onClose?.()
    }

    const handleComplete = () => {
      if (state.semesterName && state.semesterDates && state.breakDates) {
        onComplete?.({
          semesterName: state.semesterName,
          semesterDates: state.semesterDates,
          breakDates: state.breakDates,
        })
      }
      handleClose()
    }

    const steps = [
      {
        title: "Semester Name",
        element: (
          <SemesterNamePopUp
            key="semester-name-popup"
            onCancel={handleClose}
            onConfirm={handleSemesterNameSubmit}
            open={open && state.step === 0}
          />
        ),
      },
      {
        title: "Semester Dates",
        element: (
          <SemesterDatePopUp
            defaultValues={state.semesterDates}
            key="semester-dates-popup"
            onBack={handleBack}
            onClose={handleClose}
            onNext={handleSemesterDatesSubmit}
            open={open && state.step === 1}
            semesterName={state.semesterName || "Semester"}
            subtitle={`Select the start and end dates for ${state.semesterName || "the semester"} period`}
            title="Semester Dates"
          />
        ),
      },
      {
        title: "Break Dates",
        element: (
          <SemesterDatePopUp
            defaultValues={state.breakDates}
            key="break-dates-popup"
            onBack={handleBack}
            onClose={handleClose}
            onNext={handleBreakDatesSubmit}
            open={open && state.step === 2}
            semesterName={state.semesterName || "Semester"}
            subtitle={`Select the start and end dates for ${state.semesterName || "the semester"} break period`}
            title={"Semester Break" + "\n" + "Start & End"}
          />
        ),
      },
      {
        title: "Semester Created",
        element: (
          <SemesterCreatedPopUp
            isOpen={open && state.step === 3}
            key="semester-created-popup"
            onClose={handleComplete}
            subtitle={`${state.semesterName || "Semester"} created.\nNote: Semester name can be edited later.`}
            title="Semester Created"
          />
        ),
      },
    ]

    if (!open) return null

    return (
      <>
        {steps.map((step) => (
          <div key={step.title}>{step.element}</div>
        ))}
      </>
    )
  },
)

CreateSemesterPopUpFlow.displayName = "CreateSemesterPopUpFlow"
