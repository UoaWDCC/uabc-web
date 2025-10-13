import type { CreateUserRequest } from "@repo/shared/types"
import { noop } from "@yamada-ui/react"
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react"
import { FilterActions } from "./FilterActions"

const FilterActionsContext = createContext<FilterActionsContextValue | undefined>(undefined)

/**
 * Context value containing functions for filter actions.
 */
export type FilterActionsContextValue = {
  /**
   * Function to add member to site.
   */
  addMember: (data: CreateUserRequest) => void
  /**
   * setState function to set the addMember function.
   */
  setAddMember: Dispatch<SetStateAction<(data: CreateUserRequest) => void>>
  /**
   * Function to export member data as a csv.
   */
  exportData: (selectedRows: Set<string>) => void
  /**
   * setState function to set the exportData function.
   */
  setExportData: Dispatch<SetStateAction<(selectedRows: Set<string>) => void>>
}

/**
 * Filter actions context provider that allows Tanstack mutations/queries to be set and passed down
 * to {@link FilterActions}.
 */
export const FilterActionsProvider = ({ children }: { children: ReactNode }) => {
  const [addMember, setAddMember] = useState<(data: CreateUserRequest) => void>(noop)
  const [exportData, setExportData] = useState<(data: Set<string>) => void>(noop)

  return (
    <FilterActionsContext value={{ addMember, setAddMember, exportData, setExportData }}>
      {children}
    </FilterActionsContext>
  )
}

/**
 * Hook to access filter action functions.
 *
 * @returns Filter actions context value
 * @throws Error if used outside of FilterActionsProvider
 */
export const useFilterActions = () => {
  const context = useContext(FilterActionsContext)
  if (!context) {
    throw new Error("useFilterActions must be used within a FilterActionsProvider")
  }
  return context
}
