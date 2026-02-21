"use client"

import type {
  CreateSemesterData,
  SemesterInfoPopUpValues,
  SemesterNamePopUpValues,
  Weekday,
} from "@repo/shared"
import { memo, useReducer } from "react"
import { SemesterCreatedPopUp } from "./SemesterCreatedPopUp"
import { SemesterDatePopUp } from "./SemesterDatePopUp"
import { SemesterInfoPopUp } from "./SemesterInfoPopUp"
import { SemesterNamePopUp } from "./SemesterNamePopUp"

interface SemesterFlowState {
  step: number
  name?: string
  startDate?: string
  endDate?: string
  breakStart?: string
  breakEnd?: string
  bookingOpenDay?: string
  bookingOpenTime?: string
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
  | { type: "SET_INFO"; payload: { bookingOpenDay: string; bookingOpenTime: string } }
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
        name: action.payload,
      }
    case "SET_SEMESTER_DATES":
      return {
        ...state,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
      }
    case "SET_BREAK_DATES":
      return {
        ...state,
        breakStart: action.payload.startDate,
        breakEnd: action.payload.endDate,
      }
    case "SET_INFO":
      return {
        ...state,
        bookingOpenDay: action.payload.bookingOpenDay,
        bookingOpenTime: action.payload.bookingOpenTime,
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
  onComplete?: (data: CreateSemesterData) => void
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

    const handleBookingOpenSubmit = (data: SemesterInfoPopUpValues) => {
      const [hours, minutes] = data.bookingOpenTime.split(":").map(Number)
      const bookingOpenTime = new Date(Date.UTC(1970, 0, 1, hours, minutes)).toISOString()
      dispatch({
        type: "SET_INFO",
        payload: { bookingOpenDay: data.bookingOpenDay, bookingOpenTime },
      })
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
      if (
        state.name &&
        state.startDate &&
        state.endDate &&
        state.breakStart &&
        state.breakEnd &&
        state.bookingOpenDay &&
        state.bookingOpenTime
      ) {
        onComplete?.({
          name: state.name,
          startDate: state.startDate,
          endDate: state.endDate,
          breakStart: state.breakStart,
          breakEnd: state.breakEnd,
          bookingOpenDay: state.bookingOpenDay as Weekday,
          bookingOpenTime: state.bookingOpenTime,
        })
      }
      handleClose()
    }

    const bookingOpenTimeDisplay = state.bookingOpenTime
      ? `${String(new Date(state.bookingOpenTime).getUTCHours()).padStart(2, "0")}:${String(new Date(state.bookingOpenTime).getUTCMinutes()).padStart(2, "0")}`
      : undefined

    const steps = [
      {
        title: "Semester Name",
        element: (
          <SemesterNamePopUp
            defaultValues={state.name ? { name: state.name } : { name: "" }}
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
            defaultValues={
              state.startDate && state.endDate
                ? { startDate: state.startDate, endDate: state.endDate }
                : undefined
            }
            key="semester-dates-popup"
            onBack={handleBack}
            onClose={handleClose}
            onNext={handleSemesterDatesSubmit}
            open={open && state.step === 1}
            semesterName={state.name || "Semester"}
            subtitle="Select the semester start and end dates on the calendar"
            title="Semester Dates"
          />
        ),
      },
      {
        title: "Break Dates",
        element: (
          <SemesterDatePopUp
            dateRange={
              state.startDate && state.endDate
                ? { startDate: state.startDate, endDate: state.endDate }
                : undefined
            }
            defaultValues={
              state.breakStart && state.breakEnd
                ? { startDate: state.breakStart, endDate: state.breakEnd }
                : undefined
            }
            key="break-dates-popup"
            onBack={handleBack}
            onClose={handleClose}
            onNext={handleBreakDatesSubmit}
            open={open && state.step === 2}
            semesterName={state.name || "Semester"}
            subtitle={`Select the semester break's start and end dates on the calendar`}
            // biome-ignore lint/style/useConsistentCurlyBraces: Need to use this else the \n gets parsed as normal text
            title={"Semester Break\nStart & End"}
          />
        ),
      },
      {
        title: "Booking Settings",
        element: (
          <SemesterInfoPopUp
            defaultValues={{
              bookingOpenDay: state.bookingOpenDay as
                | SemesterInfoPopUpValues["bookingOpenDay"]
                | undefined,
              bookingOpenTime: bookingOpenTimeDisplay,
            }}
            key="semester-booking-popup"
            onBack={handleBack}
            onClose={handleClose}
            onNext={handleBookingOpenSubmit}
            open={open && state.step === 3}
          />
        ),
      },
      {
        title: "Semester Created",
        element: (
          <SemesterCreatedPopUp
            key="semester-created-popup"
            onClose={handleComplete}
            open={open && state.step === 4}
            subtitle={`${state.name || "Semester"} has been created.`}
            title="Semester Created"
          />
        ),
      },
    ]

    if (!open) return null

    return steps[state.step]?.element || null
  },
)

CreateSemesterPopUpFlow.displayName = "CreateSemesterPopUpFlow"
