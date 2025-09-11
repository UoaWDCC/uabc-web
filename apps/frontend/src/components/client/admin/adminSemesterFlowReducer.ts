// apps/frontend/src/components/client/admin/adminSemesterFlowReducer.ts

export type SemesterFlowStep = "name" | "dates" | "breaks" | "success"

export type AdminSemesterFlowState = {
  step: SemesterFlowStep
  name: string
  startDate: string // using string for now for easier input handling
  endDate: string
  breakStartDate: string
  breakEndDate: string
  // startDate: Date | null --- IGNORE ---
  // endDate: Date | null --- IGNORE ---
  // breakStartDate: Date | null --- IGNORE ---
  // breakEndDate: Date | null --- IGNORE ---
}

export type AdminSemesterFlowAction =
  | { type: "SET_NAME"; payload: string }

  // set to string for easier input handling
  // This will be used to set Dates type in the future
  | { type: "SET_START_DATE"; payload: string }
  | { type: "SET_END_DATE"; payload: string }
  | { type: "SET_BREAK_START_DATE"; payload: string }
  | { type: "SET_BREAK_END_DATE"; payload: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" }

export const initialState: AdminSemesterFlowState = {
  step: "name",
  name: "",
  startDate: "",
  endDate: "",
  breakStartDate: "",
  breakEndDate: "",
}

export function createAdminSemesterFlowReducer() {
  return function adminSemesterFlowReducer(
    state: AdminSemesterFlowState,
    action: AdminSemesterFlowAction,
  ): AdminSemesterFlowState {
    switch (action.type) {
      case "NEXT_STEP":
        switch (state.step) {
          case "name":
            return { ...state, step: "dates" }
          case "dates":
            return { ...state, step: "breaks" }
          case "breaks":
            return { ...state, step: "success" }
          default:
            return state
        }
      case "PREV_STEP":
        switch (state.step) {
          case "dates":
            return { ...state, step: "name", name: "" }
          case "breaks":
            return { ...state, step: "dates" }
          default:
            return state
        }
      case "SET_NAME":
        return { ...state, name: action.payload }

      case "SET_START_DATE":
        return { ...state, startDate: action.payload }

      case "SET_END_DATE":
        return { ...state, endDate: action.payload }

      case "SET_BREAK_START_DATE":
        return { ...state, breakStartDate: action.payload }

      case "SET_BREAK_END_DATE":
        return { ...state, breakEndDate: action.payload }

      case "RESET":
        return initialState
      default:
        return state
    }
  }
}
