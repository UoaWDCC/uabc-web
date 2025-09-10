// apps/frontend/src/components/client/admin/adminSemesterFlowReducer.ts

export type SemesterFlowStep = "details" | "confirmation" | "done"

export type AdminSemesterFlowState = {
  step: SemesterFlowStep
  name: string
  // Add more fields for subsequent steps here
}

export type AdminSemesterFlowAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" }

export const initialState: AdminSemesterFlowState = {
  step: "details",
  name: "",
}

export function createAdminSemesterFlowReducer() {
  return function adminSemesterFlowReducer(
    state: AdminSemesterFlowState,
    action: AdminSemesterFlowAction,
  ): AdminSemesterFlowState {
    switch (action.type) {
      case "SET_NAME":
        return { ...state, name: action.payload }
      case "NEXT_STEP":
        switch (state.step) {
          case "details":
            return { ...state, step: "confirmation" }
          case "confirmation":
            return { ...state, step: "done" }
          default:
            return state
        }
      case "PREV_STEP":
        switch (state.step) {
          case "confirmation":
            return { ...state, step: "details" }
          default:
            return state
        }
      case "RESET":
        return initialState
      default:
        return state
    }
  }
}
