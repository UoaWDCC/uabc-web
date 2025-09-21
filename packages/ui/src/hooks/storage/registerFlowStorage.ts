import { RegisterFlowStateSchema } from "@repo/shared"
import type { RegisterFlowState } from "@repo/shared/types"
import { useLocalStorage } from "@repo/ui/hooks"

const LOCAL_STORAGE_KEY = "register-flow"

/**
 * React hook for managing register flow state in localStorage
 * This hook provides a way to persist register flow data across sessions
 * with schema validation and automatic cleanup of expired data.
 *
 * @returns Object containing register flow data, setter, and utility functions
 */
export const useRegisterFlowStorage = () => {
  return useLocalStorage<RegisterFlowState>(LOCAL_STORAGE_KEY, RegisterFlowStateSchema)
}
